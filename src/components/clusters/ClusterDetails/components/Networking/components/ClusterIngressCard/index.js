import { connect } from 'react-redux';

import { isHibernating, isOffline } from '../../../../../common/clusterStates';
import { openModal } from '../../../../../../common/Modal/ModalActions';
import NetworkingSelector, { routeSelectorPairsAsStrings } from '../../NetworkingSelector';

import ClusterIngressCard from './ClusterIngressCard';

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const clusterRouters = NetworkingSelector(state);
  const hasAdditionalRouter = Object.keys(clusterRouters).length === 2;

  const consoleURL = cluster.console?.url;
  const controlPlaneAPIEndpoint = cluster.api?.url;
  const additionalRouterAddress = hasAdditionalRouter
    ? clusterRouters.additional.address
    : `apps2${clusterRouters.default.address.substr(4)}`;
  const additionalRouterLabels = routeSelectorPairsAsStrings(
    clusterRouters?.additional?.routeSelectors,
  );

  const provider = cluster.cloud_provider?.id;

  const isApiPrivate = cluster.api?.listening === 'internal';
  const isAdditionalRouterPrivate = !!clusterRouters?.additional?.isPrivate;

  const { canEdit } = cluster;
  const isReadOnly = cluster?.status?.configuration_mode === 'read_only';
  const isSTSEnabled = cluster?.aws?.sts?.enabled === true;
  const clusterHibernating = isHibernating(cluster.state);
  const showConsoleLink = consoleURL && !isOffline(cluster.state);

  return {
    consoleURL,
    controlPlaneAPIEndpoint,
    additionalRouterAddress,
    additionalRouterLabels,
    isApiPrivate,
    isAdditionalRouterPrivate,
    hasAdditionalRouter,
    canEdit,
    isReadOnly,
    isSTSEnabled,
    clusterHibernating,
    showConsoleLink,
    provider,
  };
};

const mapDispatchToProps = (dispatch) => ({
  openModal: (name, data) => dispatch(openModal(name, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClusterIngressCard);
