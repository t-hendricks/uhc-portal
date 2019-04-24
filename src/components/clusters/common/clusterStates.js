import { getMetricsTimeDelta } from '../../../common/helpers';

const clusterStates = {
  PENDING: 'pending',
  PENDING_ACCOUNT: 'pending_account',
  INSTALLING: 'installing',
  ERROR: 'error',
  READY: 'ready',
  UNINSTALLING: 'uninstalling',
  PATCHING: 'patching',
  UNKNOWN: 'unknown',
  WARNING: 'warning',
};

function getClusterStateAndDescription(cluster) {
  if ((cluster.state === clusterStates.INSTALLING
      || cluster.state === clusterStates.PENDING
      || cluster.state === clusterStates.PENDING_ACCOUNT)
      && getMetricsTimeDelta(new Date(cluster.creation_timestamp)) >= 2) {
    return {
      state: clusterStates.WARNING,
      description: 'Installation is taking longer than expected',
      style: undefined,
    };
  }
  if (cluster.state === clusterStates.PENDING_ACCOUNT) {
    return {
      state: clusterStates.PENDING,
      description: 'Pending account creation',
      style: undefined,
    };
  }
  return {
    state: cluster.state,
    description: cluster.state,
    style: { textTransform: 'capitalize' },
  };
}

export { getClusterStateAndDescription };
export default clusterStates;
