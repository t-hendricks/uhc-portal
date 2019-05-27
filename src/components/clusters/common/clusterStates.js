import { getTimeDelta } from '../../../common/helpers';

const clusterStates = {
  PENDING: 'pending',
  INSTALLING: 'installing',
  ERROR: 'error',
  READY: 'ready',
  UNINSTALLING: 'uninstalling',
  PATCHING: 'patching',
  UNKNOWN: 'unknown',
  WARNING: 'warning',
  STALE: 'stale',
  ARCHIVED: 'archived',
};

function getClusterStateAndDescription(cluster) {
  if ((cluster.state === clusterStates.INSTALLING
      || cluster.state === clusterStates.PENDING)
      && getTimeDelta(new Date(cluster.creation_timestamp)) > 2) {
    return {
      state: clusterStates.WARNING,
      description: 'Installation is taking longer than expected',
      style: undefined,
    };
  }
  if (cluster.state === clusterStates.READY) {
    const { cpu, memory, storage } = cluster.metrics;

    const cpuLastActive = getTimeDelta(new Date(cpu.updated_timestamp));
    const memoryLastActive = getTimeDelta(new Date(memory.updated_timestamp));
    const storageLastActive = getTimeDelta(new Date(storage.updated_timestamp));
    const creationDelta = getTimeDelta(new Date(cluster.creation_timestamp));

    const lastActive = Math.min(cpuLastActive, memoryLastActive, storageLastActive, creationDelta);

    if (lastActive > 24 * 7) {
      return {
        state: clusterStates.ARCHIVED,
        description: 'No metrics sent during the last week',
        style: undefined,
      };
    }
    if (lastActive > 12) {
      return {
        state: clusterStates.STALE,
        description: 'No metrics sent during the last 12 hours',
        style: undefined,
      };
    }
  }
  return {
    state: cluster.state,
    description: cluster.state,
    style: { textTransform: 'capitalize' },
  };
}

export { getClusterStateAndDescription };
export default clusterStates;
