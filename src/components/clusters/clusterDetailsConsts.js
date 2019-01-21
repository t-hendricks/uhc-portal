const metricsStatusMessages = {
  installing: 'This cluster is installing so some data might not be available. This may take a few minutes.',
  pending: 'This cluster is installing so some data might not be available. This may take a few minutes.',
  error: 'An error occured',
  uninstalling: 'This cluster is being deleted so some data might not be available.',
  patching: 'The cluster currently does not have any metrics data. Please try again later.',
  unknown: 'The cluster currently does not have any metrics data. Please try again later.',
  default: 'The cluster currently does not have any metrics data. Please try again later.',
};

// metrics are available with max delta of 2 hours from last update
const maxMetricsTimeDelta = 2;

const clusterDetailConsts = {
  metricsStatusMessages,
  maxMetricsTimeDelta,
};

export { clusterDetailConsts, metricsStatusMessages, maxMetricsTimeDelta };
