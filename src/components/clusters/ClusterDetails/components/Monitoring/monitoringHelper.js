import get from 'lodash/get';
import moment from 'moment';
import { subscriptionStatuses } from '../../../../../common/subscriptionTypes';
import { hasCpuAndMemory } from '../../clusterDetailsHelper';
import { maxMetricsTimeDelta } from '../../../common/ResourceUsage/ResourceUsage.consts';

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

/**
 * Get the number of items matches some criteria from a set of data
 * Example:
 * An item is considered an issue if it's value of the health criteria mathces the value
 * of the definition of issue for this data.
 * An Alert has an issue if alert's severity is critical.
 * Therefore: issuesSelector(alerts, 'severity', 'critical' )
 * @param {Array} data
 * @param {string} healthCriteria
 * @param {string} match
 */
const countByCriteria = (data, healthCriteria, match) => data.filter(
  item => item[healthCriteria] === match,
).length;

const hasResourceUsageMetrics = (cluster) => {
  const metricsLastUpdate = moment.utc(get(cluster, 'metrics.cpu.updated_timestamp', 0));
  const now = moment.utc();
  const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;
  const isDisconnected = get(cluster, 'subscription.status', false) === subscriptionStatuses.DISCONNECTED;

  const metricsAvailable = !isArchived
   && !isDisconnected
   && hasCpuAndMemory(get(cluster, 'metrics.cpu', null), get(cluster, 'metrics.memory', null))
   && (OCM_SHOW_OLD_METRICS
   || (now.diff(metricsLastUpdate, 'hours') < maxMetricsTimeDelta));

  return metricsAvailable;
};

// Assure that the base console url is well formatted with trailing '/' and ready
// for concatenations.
const consoleURLSetup = (clusterConsole) => {
  if (clusterConsole && clusterConsole.url) {
    let consoleURL = clusterConsole.url;
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
  hasResourceUsageMetrics,
  countByCriteria,
};
