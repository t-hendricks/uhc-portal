const monitoringStatuses = {
  HEALTHY: 'HEALTHY',
  HAS_ISSUES: 'HAS_ISSUES',
  DISCONNECTED: 'DISCONNECTED',
  NO_METRICS: 'NO_METRICS',
  INSTALLING: 'INSTALLING',
  UPGRADING: 'UPGRADING',
  UNKNOWN: 'UNKNOWN',
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

const thresholds = {
  WARNING: 0.8,
  DANGER: 0.95,
};

export {
  monitoringStatuses, alertsSeverity, operatorsStatuses, thresholds,
};
