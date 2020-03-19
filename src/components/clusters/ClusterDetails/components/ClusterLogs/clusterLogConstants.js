const GET_CLUSTER_LOGS = 'GET_CLUSTER_LOGS';
const DOWNLOAD_CLUSTER_LOGS = 'DOWNLOAD_CLUSTER_LOGS';

const SEVERITY_TYPES = [
  'Debug',
  'Info',
  'Warning',
  'Error',
  'Fatal',
];

const clusterLogConstants = {
  GET_CLUSTER_LOGS,
  DOWNLOAD_CLUSTER_LOGS,
  SEVERITY_TYPES,
};

export {
  GET_CLUSTER_LOGS, DOWNLOAD_CLUSTER_LOGS, SEVERITY_TYPES,
};
export default clusterLogConstants;
