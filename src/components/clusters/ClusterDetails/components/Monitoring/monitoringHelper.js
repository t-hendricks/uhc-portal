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

const monitoringItemTypes = {
  NODE: 'node',
  ALERT: 'alert',
  OPERATOR: 'operator',
};

const baseURLProps = {
  rel: 'noopener noreferrer',
  target: '_blank',
};

// Assure that the base console url is well formatted with trailing '/' and ready
// for concatenations.
const consoleURLSetup = (clusterConsole) => {
  let consoleURL = clusterConsole.url;
  if (clusterConsole && consoleURL) {
    if (consoleURL.charAt(consoleURL.length - 1) !== '/') {
      consoleURL += '/';
    }
    return consoleURL;
  }
  return null;
};

function monitoringItemLinkProps(clusterConsole, itemType, itemName) {
  const consoleURL = consoleURLSetup(clusterConsole);
  let href;
  if (consoleURL) {
    switch (itemType) {
      case monitoringItemTypes.ALERT:
        href = `${consoleURL}monitoring/alerts?orderBy=asc&sortBy=Severity&alert-name=${itemName}`;
        break;
      case monitoringItemTypes.NODE:
        href = `${consoleURL}k8s/cluster/nodes/${itemName}`;
        break;
      case monitoringItemTypes.OPERATOR:
        href = `${consoleURL}k8s/cluster/config.openshift.io~v1~ClusterOperator/${itemName}`;
        break;
      default:
        return null;
    }
    return { ...baseURLProps, href };
  }
  return null;
}

export {
  monitoringStatuses,
  alertsSeverity,
  operatorsStatuses,
  thresholds,
  monitoringItemLinkProps,
  monitoringItemTypes,
};
