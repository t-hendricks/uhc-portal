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

const operatorsStatuses = {
  AVAILABLE: 'available',
  FAILING: 'failing',
  UPGRADING: 'upgrading',
  DEGRADED: 'degraded',
  UNKNOWN: 'unknown',
};

export { monitoringStatuses, alertsSeverity, operatorsStatuses };
