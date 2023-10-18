const GET_CLUSTER_LOGS = 'GET_CLUSTER_LOGS';
const RESET_CLUSTER_HISTORY = 'RESET_CLUSTER_HISTORY';

const SEVERITY_TYPES = ['Debug', 'Info', 'Warning', 'Error', 'Major', 'Critical', 'Fatal'];
const LOG_TYPES = [
  'clustercreate-high-level',
  'clustercreate-details',
  'clusterremove-high-level',
  'clusterremove-details',
  'cluster-state-updates',
  'Customer data',
  'Customer applications',
  'Developer services',
  'Platform monitoring',
  'Logging',
  'Application networking',
  'Cluster networking',
  'Virtual networking management',
  'Virtual compute management',
  'Cluster version',
  'Capacity management',
  'Virtual storage management',
  'AWS software',
  'Hardware/AWS global infrastructure',
];

const clusterLogConstants = {
  GET_CLUSTER_LOGS,
  SEVERITY_TYPES,
  LOG_TYPES,
  RESET_CLUSTER_HISTORY,
};

export { GET_CLUSTER_LOGS, SEVERITY_TYPES, LOG_TYPES, RESET_CLUSTER_HISTORY };
export default clusterLogConstants;
