import get from 'lodash/get';
import { Config as AIConfig } from 'openshift-assisted-ui-lib';
import { subscriptionStatuses } from '../../../common/subscriptionTypes';
import isAssistedInstallSubscription from '../../../common/isAssistedInstallerCluster';

const clusterStates = {
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

  if (isAssistedInstallSubscription(cluster.subscription)) {
    state = AIConfig.CLUSTER_STATUS_LABELS[cluster.status];
  } else if ((cluster.state === clusterStates.INSTALLING
      || cluster.state === clusterStates.PENDING)) {
    state = clusterStates.INSTALLING;
  } else if (get(cluster, 'metrics.upgrade.state') === 'running' && !cluster.managed) {
    state = clusterStates.UPDATING;
  }
  if (!cluster.managed
    && cluster.subscription.status === subscriptionStatuses.DISCONNECTED) {
    state = clusterStates.DISCONNECTED;
  } else if (cluster.subscription.status === subscriptionStatuses.DEPROVISIONED) {
    state = clusterStates.DEPROVISIONED;
  } else if (cluster.subscription.status === subscriptionStatuses.ARCHIVED) {
    state = clusterStates.ARCHIVED;
  } else if (cluster.state === clusterStates.READY) {
    state = clusterStates.READY;
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
  } else if (!cluster.managed
    && cluster.subscription.status === subscriptionStatuses.ACTIVE) {
    state = clusterStates.READY;
  } else if (!cluster.managed
    && cluster.subscription.status === subscriptionStatuses.STALE) {
    state = clusterStates.STALE;
  }

  return {
    state,
    description: stateDescription(state),
  };
}

const isHibernating = state => state === clusterStates.HIBERNATING
  || state === clusterStates.POWERING_DOWN
  || state === clusterStates.RESUMING;

export { getClusterStateAndDescription, isHibernating };
export default clusterStates;
