import get from 'lodash/get';
import { subscriptionStatuses, normalizedProducts } from '../../../common/subscriptionTypes';

const clusterStates = {
  WAITING: 'waiting',
  PENDING: 'pending',
  INSTALLING: 'installing',
  UPDATING: 'updating',
  READY: 'ready',
  UNINSTALLING: 'uninstalling',
  HIBERNATING: 'hibernating',
  POWERING_DOWN: 'powering_down',
  RESUMING: 'resuming',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
  DEPROVISIONED: 'deprovisioned',
  ARCHIVED: 'archived',
  STALE: 'stale',
  VALIDATING: 'validating',
};

const getStateDescription = (state) => {
  let description = '';
  switch (state) {
    case clusterStates.DEPROVISIONED:
      description = 'Deleted';
      break;
    default:
      if (state) {
        // Capitalize the first letter and replace any underscore with space.
        description = (state.charAt(0).toUpperCase() + state.slice(1)).replace(/_/g, ' ');
      }
      break;
  }
  return description;
};

// This function is not meant to return status of uninstalled OCP-AssistedInstall clusters.
// To display the status for those, use the component <AIClusterStatus />
function getClusterStateAndDescription(cluster) {
  let state;

  // the state is determined by subscriptions.status or cluster.state.
  // the conditions are not mutually exclusive and are ordered by priority, e.g., STALE and READY.
  if (cluster.subscription.status === subscriptionStatuses.DISCONNECTED) {
    state = clusterStates.DISCONNECTED;
  } else if (cluster.subscription.status === subscriptionStatuses.DEPROVISIONED) {
    state = clusterStates.DEPROVISIONED;
  } else if (cluster.subscription.status === subscriptionStatuses.ARCHIVED) {
    state = clusterStates.ARCHIVED;
  } else if (
    cluster.state === clusterStates.INSTALLING ||
    cluster.state === clusterStates.VALIDATING ||
    cluster.state === clusterStates.PENDING
  ) {
    state = clusterStates.INSTALLING;
  } else if (cluster.state === clusterStates.WAITING) {
    state = clusterStates.WAITING;
  } else if (cluster.state === clusterStates.UNINSTALLING) {
    state = clusterStates.UNINSTALLING;
  } else if (cluster.state === clusterStates.ERROR) {
    state = clusterStates.ERROR;
  } else if (cluster.state === clusterStates.HIBERNATING) {
    state = clusterStates.HIBERNATING;
  } else if (cluster.state === clusterStates.POWERING_DOWN) {
    state = clusterStates.POWERING_DOWN;
  } else if (cluster.state === clusterStates.RESUMING) {
    state = clusterStates.RESUMING;
  } else if (cluster.subscription.status === subscriptionStatuses.STALE) {
    state = clusterStates.STALE;
  } else if (get(cluster, 'metrics.upgrade.state') === 'running') {
    state = clusterStates.UPDATING;
  } else if (
    cluster.subscription.status === subscriptionStatuses.ACTIVE ||
    cluster.state === clusterStates.READY
  ) {
    state = clusterStates.READY;
  }

  return {
    state,
    description: getStateDescription(state),
  };
}

const getInflightChecks = (cluster) => {
  const inflightChecks = get(cluster, 'inflight_checks', []);
  return Array.isArray(inflightChecks) ? inflightChecks : [];
};

const isHibernating = (state) =>
  state === clusterStates.HIBERNATING ||
  state === clusterStates.POWERING_DOWN ||
  state === clusterStates.RESUMING;

// Indicates that this is a ROSA cluster
const isROSA = (cluster) => cluster.product.id === normalizedProducts.ROSA;

// Indicates that this is an OSD cluster
const isOSD = (cluster) =>
  cluster.product.id === normalizedProducts.OSD ||
  cluster.product.id === normalizedProducts.OSDTrial;

// Indicates that this is a ROSA cluster with manual mode
const isROSAManualMode = (cluster) =>
  isROSA(cluster) && !cluster?.aws?.sts?.auto_mode && !cluster?.aws?.sts?.oidc_config?.id;

const isHypershiftCluster = (cluster) =>
  get(cluster, 'hypershift.enabled', false) ||
  get(cluster, 'subscription.plan.id') === normalizedProducts.ROSA_HyperShift;

// Indicates that cluster is waiting and an oidc_config.id had been specified
const isWaitingForOIDCProviderOrOperatorRolesMode = (cluster) =>
  isROSA(cluster) &&
  cluster.state === clusterStates.WAITING &&
  !cluster?.aws?.sts?.auto_mode &&
  cluster?.aws?.sts?.oidc_config?.id;

// Indicates that this is a Waiting Hypershift cluster
const isWaitingHypershiftCluster = (cluster) =>
  cluster.state === clusterStates.WAITING && isHypershiftCluster(cluster);

const isWaitingROSAManualMode = (cluster) =>
  cluster.state === clusterStates.WAITING &&
  isROSAManualMode(cluster) &&
  !isHypershiftCluster(cluster);

const isOffline = (state) => isHibernating(state) || state === clusterStates.UNINSTALLING;

const getClusterAIPermissions = (cluster) => ({
  canEdit: cluster.canEdit,
});

export {
  getClusterStateAndDescription,
  isHibernating,
  isOffline,
  isROSA,
  isOSD,
  isHypershiftCluster,
  isROSAManualMode,
  isWaitingROSAManualMode,
  isWaitingHypershiftCluster,
  getClusterAIPermissions,
  getStateDescription,
  getInflightChecks,
  isWaitingForOIDCProviderOrOperatorRolesMode,
};
export default clusterStates;
