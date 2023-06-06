import { connect } from 'react-redux';
import { formValueSelector, reduxForm } from 'redux-form';

import { knownProducts } from '../../../../../../../common/subscriptionTypes';
import modals from '../../../../../../common/Modal/modals';
import shouldShowModal from '../../../../../../common/Modal/ModalSelectors';
import { closeModal } from '../../../../../../common/Modal/ModalActions';
import NetworkingSelector, { routeSelectorsAsString } from '../../NetworkingSelector';
import { resetEditRoutersResponse, saveNetworkingConfiguration } from '../../NetworkingActions';

import EditClusterIngressDialog from './EditClusterIngressDialog';

const reduxFormConfig = {
  form: 'EditClusterIngress',
  enableReinitialize: true,
};

const reduxFormEditIngress = reduxForm(reduxFormConfig)(EditClusterIngressDialog);

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const clusterRouters = NetworkingSelector(state);
  const hasAdditionalRouter = Object.keys(clusterRouters).length === 2;

  const valueSelector = formValueSelector('EditClusterIngress');
  const additionalRouterEnabled = valueSelector(state, 'enable_additional_router');
  const APIPrivate = cluster.api.listening === 'internal';
  const subscriptionPlan = cluster.subscription?.plan?.type;

  return {
    editClusterRoutersResponse: state.clusterRouters.editRouters,
    controlPlaneAPIEndpoint: cluster.api.url,
    defaultRouterAddress: clusterRouters.default.address,
    additionalRouterAddress: hasAdditionalRouter
      ? clusterRouters.additional.address
      : `apps2${clusterRouters.default.address.substr(4)}`,
    initialValues: {
      private_api: APIPrivate,
      private_default_router: clusterRouters.default.isPrivate,
      enable_additional_router: hasAdditionalRouter,
      private_additional_router: !!clusterRouters?.additional?.isPrivate,
      labels_additional_router: routeSelectorsAsString(clusterRouters?.additional?.routeSelectors),
      load_balancer: clusterRouters.default.loadBalancer === 'nlb',
    },
    clusterID: cluster.id,
    clusterRouters,
    APIPrivate,
    additionalRouterEnabled,
    hideAdvancedOptions: subscriptionPlan === knownProducts.ROSA,
    isOpen: shouldShowModal(state, modals.EDIT_CLUSTER_INGRESS),
    /**
     * an alert should appear if both routers are enabled, at least one is private,
     * and there are no route selectors applied to the additional router.
     */
    showRouterVisibilityWarning:
      additionalRouterEnabled &&
      !valueSelector(state, 'labels_additional_router') &&
      (valueSelector(state, 'private_default_router') ||
        valueSelector(state, 'private_additional_router')),
  };
};

const mapDispatchToProps = (dispatch) => ({
  resetResponse: () => dispatch(resetEditRoutersResponse()),
  closeModal: () => dispatch(closeModal(modals.EDIT_CLUSTER_INGRESS)),
  onSubmit: (formData, clusterRouters, APIPrivate, clusterID) => {
    const currentData = { ...clusterRouters, APIPrivate };
    dispatch(saveNetworkingConfiguration(formData, currentData, clusterID));
  },
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const onSubmit = (formData) => {
    dispatchProps.onSubmit(
      formData,
      stateProps.clusterRouters,
      stateProps.APIPrivate,
      stateProps.clusterID,
    );
  };
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onSubmit,
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(reduxFormEditIngress);
