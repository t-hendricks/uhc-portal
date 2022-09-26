import get from 'lodash/get';
import moment from 'moment';
import config from '../../../../../config';
import { subscriptionStatuses } from '../../../../../common/subscriptionTypes';
import { hasCpuAndMemory } from '../../clusterDetailsHelper';

const monitoringStatuses = {
  HEALTHY: 'HEALTHY',
  HAS_ISSUES: 'HAS_ISSUES',
  DISCONNECTED: 'DISCONNECTED',
  NO_METRICS: 'NO_METRICS',
  UPGRADING: 'UPGRADING',
  UNKNOWN: 'UNKNOWN',
};

const alertsSeverity = {
  WARNING: 'warning',
  CRITICAL: 'critical',
  INFO: 'info',
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
 * Returns true if an object has a property named 'data' which is not empty,
 * otherwise returns false.
 * @param {Object} obj
 */
const hasData = (obj) => get(obj, 'data.length', 0) > 0;

/**
 * Get the number of issues and warnings by some defined criteria for each of them
 * An item is considered an issue if it's value of the health criteria matches the value
 * of the definition of issue for this data, and considered a warning if it
 * matches some other criteria.
 * Alerts data has an issue if alert's severity is 'critical'.
 * Alerts data has a warning if alert's severity is 'warning'.
 * Example: getIssuesAndWarnings(alerts, 'severity', 'critical', 'warning' )
 * @param {Array} data
 * @param {string} criteria
 * @param {string} issuesMatch
 * @param {string} warningsMatch
 */

const getIssuesAndWarnings = ({ data, criteria, issuesMatch, warningsMatch }) => {
  if (!data || data.length === 0) {
    return { issuesCount: null, warningsCount: null };
  }
  let issuesCount = 0;
  let warningsCount = warningsMatch ? 0 : null;

  data.forEach((element) => {
    if (element[criteria] === issuesMatch) {
      issuesCount += 1;
    }
    if (warningsMatch !== null && element[criteria] === warningsMatch) {
      warningsCount += 1;
    }
  });
  return { issuesCount, warningsCount };
};

// metrics are available with max delta of 3 hours from last update
const maxMetricsTimeDelta = 3;

const hasResourceUsageMetrics = (cluster) => {
  const metricsLastUpdate = moment.utc(get(cluster, 'metrics.cpu.updated_timestamp', 0));
  const now = moment.utc();
  const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;
  const isDisconnected =
    get(cluster, 'subscription.status', false) === subscriptionStatuses.DISCONNECTED;
  const showOldMetrics = !!config.configData.showOldMetrics;

  const metricsAvailable =
    !isArchived &&
    !isDisconnected &&
    hasCpuAndMemory(get(cluster, 'metrics.cpu', null), get(cluster, 'metrics.memory', null)) &&
    (showOldMetrics || now.diff(metricsLastUpdate, 'hours') < maxMetricsTimeDelta);

  return metricsAvailable;
};

const resourceUsageIssuesHelper = (cpu, memory, threshold) => {
  if (!hasCpuAndMemory(cpu, memory)) {
    return null;
  }

  const totalCPU = cpu.total.value;
  const totalMemory = memory.total.value;

  let numOfIssues = 0;
  if (cpu && totalCPU && cpu.used.value / cpu.total.value > threshold) {
    numOfIssues += 1;
  }
  if (memory && totalMemory && memory.used.value / memory.total.value > threshold) {
    numOfIssues += 1;
  }
  return numOfIssues;
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
  maxMetricsTimeDelta,
  hasResourceUsageMetrics,
  getIssuesAndWarnings,
  hasData,
  resourceUsageIssuesHelper,
};
