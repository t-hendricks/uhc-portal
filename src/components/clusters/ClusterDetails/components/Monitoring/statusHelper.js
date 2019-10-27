const common = {
  UPDATING: 'UPDATING',
  UNKNOWN: 'UNKNOWN',
};

const monitoringStatuses = {
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
  AVAILABLE: 'available',
  FAILING: 'failing',
  UPDATING: 'updating',
  UNKNOWN: 'unknown',
};

export { monitoringStatuses, alertsSeverity, opertatorsStatuses };
