import { connect } from 'react-redux';

import { LoadBalancerFlavor } from '~/types/clusters_mgmt.v1';
import { isHibernating, isOffline } from '../../../../../common/clusterStates';
import { openModal } from '../../../../../../common/Modal/ModalActions';
import NetworkingSelector, { routeSelectorPairsAsStrings } from '../../NetworkingSelector';

import ClusterIngressCard from './ClusterIngressCard';

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const clusterRouters = NetworkingSelector(state);
  const hasAdditionalRouter = Object.keys(clusterRouters).length === 2;

  const consoleURL = cluster.console?.url;
  const controlPlaneAPIEndpoint = cluster.api.url;
  const defaultRouterAddress = clusterRouters.default.address;
  const additionalRouterAddress = hasAdditionalRouter
    ? clusterRouters.additional.address
    : `apps2${clusterRouters.default.address.substr(4)}`;
  const additionalRouterLabels = routeSelectorPairsAsStrings(
    clusterRouters?.additional?.routeSelectors,
  );

  const provider = cluster.cloud_provider?.id;

  const isApiPrivate = cluster.api.listening === 'internal';
  const isDefaultRouterPrivate = clusterRouters.default.isPrivate;
  const isAdditionalRouterPrivate = !!clusterRouters?.additional?.isPrivate;

  const { canEdit } = cluster;
  const isReadOnly = cluster?.status?.configuration_mode === 'read_only';
  const isSTSEnabled = cluster?.aws?.sts?.enabled === true;
  const clusterHibernating = isHibernating(cluster.state);
  const showConsoleLink = consoleURL && !isOffline(cluster.state);

  return {
    consoleURL,
    controlPlaneAPIEndpoint,
    defaultRouterAddress,
    additionalRouterAddress,
    additionalRouterLabels,
    isApiPrivate,
    isDefaultRouterPrivate,
    isAdditionalRouterPrivate,
    hasAdditionalRouter,
    canEdit,
    isReadOnly,
    isSTSEnabled,
    clusterHibernating,
    showConsoleLink,
    isNLB: clusterRouters.default.loadBalancer === LoadBalancerFlavor.NLB,
    provider,
  };
};

const mapDispatchToProps = (dispatch) => ({
  openModal: (name, data) => dispatch(openModal(name, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClusterIngressCard);
