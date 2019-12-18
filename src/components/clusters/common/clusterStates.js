import get from 'lodash/get';
import { subscriptionStatuses } from '../../../common/subscriptionTypes';

const clusterStates = {
  PENDING: 'pending',
  INSTALLING: 'installing',
  UPDATING: 'updating',
  READY: 'ready',
  UNINSTALLING: 'uninstalling',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
};

function getClusterStateAndDescription(cluster) {
  let state;

  if ((cluster.state === clusterStates.INSTALLING
      || cluster.state === clusterStates.PENDING)) {
    state = clusterStates.INSTALLING;
  } else if (get('cluster.metrics.upgrade.state', null) === 'running') {
    state = clusterStates.UPDATING;
  } else if (cluster.state === clusterStates.READY) {
    if (!cluster.managed
      && cluster.subscription.status === subscriptionStatuses.DISCONNECTED) {
      state = clusterStates.DISCONNECTED;
    } else {
      state = clusterStates.READY;
    }
  } else if (cluster.state === clusterStates.UNINSTALLING) {
    state = clusterStates.UNINSTALLING;
  } else if (cluster.state === clusterStates.ERROR) {
    state = clusterStates.ERROR;
  }

  return {
    state,
    description: state,
    style: { textTransform: 'capitalize' },
  };
}

export { getClusterStateAndDescription };
export default clusterStates;
