import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import get from 'lodash/get';
import { openModal } from '../../../../../../common/Modal/ModalActions';
import NetworkingSelector from '../../NetworkingSelector';
import EditClusterRoutersCard from './EditClusterRoutersCard';
import { isHibernating } from '../../../../../common/clusterStates';
import { saveNetworkingConfiguration } from '../../NetworkingActions';

const reduxFormConfig = {
  form: 'EditClusterRouters',
  enableReinitialize: true,
};

const reduxFormEditRouters = reduxForm(reduxFormConfig)(EditClusterRoutersCard);

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const clusterRouters = NetworkingSelector(state);
  const existsAdditionalRouter = Object.keys(clusterRouters).length === 2;

  const valueSelector = formValueSelector('EditClusterRouters');
  const additionalRouterEnabled = valueSelector(state, 'enable_additional_router');
  const APIPrivate = cluster.api.listening === 'internal';

  return {
    clusterID: cluster.id,
    canEdit: cluster.canEdit,
    clusterHibernating: isHibernating(cluster.state),
    isReadOnly: cluster?.status?.configuration_mode === 'read_only',
    isSTSEnabled: cluster?.aws?.sts?.enabled === true,
    initialValues: {
      private_api: APIPrivate,
      private_default_router: clusterRouters.default.isPrivate,
      enable_additional_router: existsAdditionalRouter,
      private_additional_router: existsAdditionalRouter && clusterRouters.additional.isPrivate,
      labels_additional_router: get(clusterRouters, 'additional.routeSelectors', null),
    },
    clusterRouters,
    controlPlaneAPIEndpoint: cluster.api.url,
    additionalRouterEnabled,
    defaultRouterAddress: clusterRouters.default.address,
    additionalRouterAddress: existsAdditionalRouter
      ? clusterRouters.additional.address : `apps2${clusterRouters.default.address.substr(4)}`,
    APIPrivate,
    /**
     * Alert in confirmation modal should appear if both routers are enabled,
     * at least one is private, and there are no route selectors applied to the additional router.
     */
    shouldShowAlert: additionalRouterEnabled && !valueSelector(state, 'labels_additional_router')
      && (valueSelector(state, 'private_default_router') || valueSelector(state, 'private_additional_router')),
  };
};

const mapDispatchToProps = dispatch => ({
  openModal: (name, data) => dispatch(openModal(name, data)),
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
  return ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onSubmit,
  });
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(reduxFormEditRouters);
