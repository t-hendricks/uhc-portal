import get from 'lodash/get';
import { subscriptionStatuses } from '../../../common/subscriptionTypes';

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
};

function getClusterStateAndDescription(cluster) {
  let state;

  if ((cluster.state === clusterStates.INSTALLING
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
  }


  return {
    state,
    // Capitalize the first letter and replace any underscore with space.
    description: state ? (state.charAt(0).toUpperCase() + state.slice(1)).replace(/_/g, ' ') : '',
  };
}

const isHibernating = state => state === clusterStates.HIBERNATING
  || state === clusterStates.POWERING_DOWN
  || state === clusterStates.RESUMING;

export { getClusterStateAndDescription, isHibernating };
export default clusterStates;
