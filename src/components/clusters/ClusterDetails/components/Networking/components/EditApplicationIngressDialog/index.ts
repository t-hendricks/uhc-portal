import { MapDispatchToPropsParam, MergeProps, connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Action } from 'typesafe-actions';

import { GlobalState } from '~/redux/store';
import { LoadBalancerFlavor } from '~/types/clusters_mgmt.v1';
import { canConfigureDayTwoManagedIngress } from '~/components/clusters/wizards/rosa/constants';
import modals from '../../../../../../common/Modal/modals';
import shouldShowModal from '../../../../../../common/Modal/ModalSelectors';
import { closeModal } from '../../../../../../common/Modal/ModalActions';
import EditApplicationIngressDialog from './EditApplicationIngressDialog';
import { resetEditRoutersResponse, saveNetworkingConfiguration } from '../../NetworkingActions';
import NetworkingSelector, {
  ClusterRouters,
  excludedNamespacesAsString,
  routeSelectorsAsString,
} from '../../NetworkingSelector';

const FORM_NAME = 'EditApplicationIngress';

const reduxFormConfig = {
  form: FORM_NAME,
  enableReinitialize: true,
};

type FormDataType = {};

type TDispatchProps = {
  onSubmit: (formData: FormDataType, clusterRouters: ClusterRouters, clusterID: string) => void;
};

const reduxFormEditIngress = reduxForm(reduxFormConfig)(EditApplicationIngressDialog);

const mapStateToProps = (state: GlobalState) => {
  const { cluster } = state.clusters?.details;

  const provider = cluster?.cloud_provider?.id;

  // @ts-ignore
  const isSTSEnabled = cluster?.aws?.sts?.enabled === true;

  const clusterRouters = NetworkingSelector(state);
  const clusterRoutesTlsSecretRef = clusterRouters.default?.tlsSecretRef;
  const hasSufficientIngressEditVersion = canConfigureDayTwoManagedIngress(
    cluster?.version?.raw_id || '',
  );

  const ingressProps = hasSufficientIngressEditVersion
    ? {
        defaultRouterSelectors: routeSelectorsAsString(clusterRouters.default?.routeSelectors),
        defaultRouterExcludedNamespacesFlag: excludedNamespacesAsString(
          clusterRouters.default?.excludedNamespaces,
        ),
        isDefaultRouterNamespaceOwnershipPolicyStrict:
          clusterRouters.default?.isNamespaceOwnershipPolicyStrict,
        isDefaultRouterWildcardPolicyAllowed: clusterRouters.default?.isWildcardPolicyAllowed,
        clusterRoutesTlsSecretRef,
        clusterRoutesHostname: clusterRouters.default?.hostname,
      }
    : undefined;

  const props = {
    initialValues: {
      private_default_router: clusterRouters.default?.isPrivate,
      is_nlb_load_balancer: clusterRouters.default?.loadBalancer === LoadBalancerFlavor.NLB,
      default_router_address: clusterRouters.default?.address,
      ...ingressProps,
    },
    isOpen: shouldShowModal(state, modals.EDIT_APPLICATION_INGRESS),

    clusterID: cluster?.id || '',
    provider,
    clusterRouters,
    editClusterRoutersResponse: state.clusterRouters.editRouters,

    hasSufficientIngressEditVersion,
  };

  return props;
};

const mapDispatchToProps: MapDispatchToPropsParam<TDispatchProps, {}> = (dispatch) => ({
  resetResponse: () => dispatch(resetEditRoutersResponse() as unknown as Action),
  closeModal: () => dispatch(closeModal()),
  onSubmit: (formData: FormDataType, clusterRouters: ClusterRouters, clusterID: string) => {
    const currentData = {
      ...clusterRouters,
    };

    dispatch(saveNetworkingConfiguration(formData, currentData, clusterID) as unknown as Action);
  },
});

const mergeProps: MergeProps<
  { clusterID: string; clusterRouters: ClusterRouters },
  TDispatchProps,
  {},
  {}
> = (stateProps, dispatchProps, ownProps) => {
  const onSubmit = (formData: FormDataType) => {
    dispatchProps.onSubmit(
      formData,
      stateProps.clusterRouters as ClusterRouters,
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
