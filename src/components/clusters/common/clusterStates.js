import get from 'lodash/get';
import { OCM } from 'openshift-assisted-ui-lib';
import { subscriptionStatuses, normalizedProducts } from '../../../common/subscriptionTypes';
import isAssistedInstallSubscription from '../../../common/isAssistedInstallerCluster';

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
};

const stateDescription = (state) => {
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

function getClusterStateAndDescription(cluster) {
  let state;

  // OCP-AssistenInstall uses the wording from AssisteDInstall UI.
  // refer to: https://github.com/openshift-assisted/assisted-ui-lib/blob/ec19b30fe29c69bf73cdb27a2f49738ccb4eef71/src/common/api/types.ts#L153-L164
  if (isAssistedInstallSubscription(cluster.subscription)) {
    state = OCM.Constants.CLUSTER_STATUS_LABELS[cluster.status];
  }

  // the state is determined by subscriptions.status or cluster.state.
  // the conditions are not mutually exclusive and are ordered by priority, e.g., STALE and READY.
  if (cluster.subscription.status === subscriptionStatuses.DISCONNECTED) {
    state = clusterStates.DISCONNECTED;
  } else if (cluster.subscription.status === subscriptionStatuses.DEPROVISIONED) {
    state = clusterStates.DEPROVISIONED;
  } else if (cluster.subscription.status === subscriptionStatuses.ARCHIVED) {
    state = clusterStates.ARCHIVED;
  } else if (cluster.state === clusterStates.INSTALLING
    || cluster.state === clusterStates.PENDING) {
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
  } else if (cluster.subscription.status === subscriptionStatuses.ACTIVE
    || cluster.state === clusterStates.READY) {
    state = clusterStates.READY;
  }

  return {
    state,
    description: stateDescription(state),
  };
}

const isHibernating = state => state === clusterStates.HIBERNATING
  || state === clusterStates.POWERING_DOWN
  || state === clusterStates.RESUMING;

// Indicates that this is a ROSA cluster waiting for manual creation of OIDC
// and operator roles.
const isWaitingROSAManualMode = cluster => (
  cluster.product.id === normalizedProducts.ROSA
    && cluster.state === clusterStates.WAITING
    && cluster.aws.sts
    && !cluster.aws.sts.auto_mode
);

export { getClusterStateAndDescription, isHibernating, isWaitingROSAManualMode };
export default clusterStates;
