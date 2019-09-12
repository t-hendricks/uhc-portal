const common = {
  UPDATING: 'UPDATING',
  UNKNOWN: 'UNKNOWN',
};

const statuses = {
  ...common,
  HEALTHY: 'HEALTHY',
  HAS_ISSUES: 'HAS_ISSUES',
  DISCONNECTED: 'DISCONNECTED',
  NO_METRICS: 'NO_METRICS',
  INSTALLING: 'INSTALLING',
};

const alertsSeverity = {
  WARNING: 'warning',
  CRITICAL: 'critical',
};

const opertatorsStatuses = {
  ...common,
  AVAILABLE: 'AVAILABLE',
  FAILING: 'FAILING',
};

export { statuses, alertsSeverity, opertatorsStatuses };
