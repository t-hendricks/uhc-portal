import clusterStates from '../clusterStates';

const metricsStatusMessages = {
  [clusterStates.INSTALLING]: 'This cluster is installing so some data might not be available. This may take a few minutes.',
  [clusterStates.PENDING]: 'This cluster is installing so some data might not be available. This may take a few minutes.',
  [clusterStates.WAITING]: 'This cluster requires user action before installation can start.',
  [clusterStates.ERROR]: 'An error occured',
  [clusterStates.UNINSTALLING]: 'This cluster is being deleted so some data might not be available.',
  [clusterStates.PATCHING]: 'The cluster currently does not have any metrics data. Try again later.',
  [clusterStates.STALE]: 'No metrics sent during the last 24 hours.',
  [clusterStates.LONG_STALE]: 'No metrics sent during the last week.',
  [clusterStates.UNKNOWN]: 'The cluster currently does not have any metrics data. Try again later.',
  archived: 'The cluster has been archived and does not have any metrics data.',
  default: 'The cluster currently does not have any metrics data. Try again later.',
};

const clusterDetailConsts = {
  metricsStatusMessages,
};

export { clusterDetailConsts, metricsStatusMessages };
