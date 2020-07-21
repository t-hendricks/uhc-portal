import get from 'lodash/get';

import {
  countByCriteria,
  monitoringStatuses,
  hasResourceUsageMetrics,
  alertsSeverity,
  operatorsStatuses,
  thresholds,
} from './monitoringHelper';
import { hasCpuAndMemory } from '../../clusterDetailsHelper';
import clusterStates from '../../../common/clusterStates';
import { subscriptionStatuses } from '../../../../../common/subscriptionTypes';


const lastCheckInSelector = (lastCheckIn) => {
  const MAX_DIFF_HOURS = 3;
  const date = new Date(lastCheckIn);

  if (date.getTime() > 0) {
    // clculate time delta
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    // calculate time delta in hours
    const hours = Math.floor(diff / 1000 / 60 / 60);
    // calculate time delta in minutes
    const minutes = diff / 1000 / 60;

    const values = { hours, minutes };

    if (hours > MAX_DIFF_HOURS) {
      return {
        ...values,
        message: `more than ${MAX_DIFF_HOURS} hours ago`,
      };
    }
    if (hours > 1) {
      return {
        ...values,
        message: hours === 1 ? 'one hour ago' : `${hours} hours ago`,
      };
    }
    if (minutes > 1) {
      return {
        ...values,
        message: `${Math.floor(minutes)} minutes ago`,
      };
    }
    if (minutes === 1) {
      return {
        ...values,
        message: '1 minute ago',
      };
    }
    if (minutes > 0) {
      return {
        ...values,
        message: 'less than 1 minute ago',
      };
    }
  }
  return {
    value: null,
    unit: null,
    message: 'unknown',
  };
};

const resourceUsageIssuesSelector = (cpu, memory, threshold) => {
  const totalCPU = cpu.total.value;
  const totalMemory = memory.total.value;

  if (!hasCpuAndMemory(cpu, memory)) {
    return null;
  }

  let numOfIssues = 0;
  if (cpu && totalCPU && (cpu.used.value / cpu.total.value > threshold)) {
    numOfIssues += 1;
  }
  if (memory && totalMemory && (memory.used.value / memory.total.value > threshold)) {
    numOfIssues += 1;
  }
  return numOfIssues;
};

const clusterHealthSelector = (cluster, lastCheckIn, discoveredIssues) => {
  const { hours, minutes } = lastCheckIn;

  const noFreshActivity = hours > 3 || (hours === 3 && minutes > 0);

  if (!cluster.managed && (get(cluster, 'subscription.status', false) === subscriptionStatuses.DISCONNECTED)) {
    return monitoringStatuses.DISCONNECTED;
  }

  if (cluster.metrics.upgrade.state === 'running') {
    return monitoringStatuses.UPGRADING;
  }

  if (cluster.state === clusterStates.INSTALLING || cluster.state === clusterStates.PENDING) {
    return monitoringStatuses.INSTALLING;
  }

  if (noFreshActivity) {
    return monitoringStatuses.NO_METRICS;
  }

  if (discoveredIssues > 0) {
    return monitoringStatuses.HAS_ISSUES;
  }

  return monitoringStatuses.HEALTHY;
};

/**
 * Returns true if an object has a property named 'data' which is not empty,
 * otherwise returns false.
 * @param {Object} obj
 */
const hasDataSelector = obj => get(obj, 'data.length', 0) > 0;


const issuesSelector = (state) => {
  const { cluster } = state.clusters.details;
  const { alerts, nodes, operators } = state.monitoring;

  const cpu = get(state, 'clusters.details.cluster.metrics.cpu', null);
  const memory = get(state, 'clusters.details.cluster.metrics.memory', null);

  // For each entity, check if there is data available
  const hasAlerts = hasDataSelector(alerts);
  const hasNodes = hasDataSelector(nodes);
  const hasClusterOperators = hasDataSelector(operators);
  const hasResourceUsageData = hasCpuAndMemory(cpu, memory) && hasResourceUsageMetrics(cluster);

  // Calculate the number of issues
  const alertsIssues = hasAlerts ? countByCriteria(alerts.data, 'severity', alertsSeverity.CRITICAL) : null;
  const nodesIssues = hasNodes ? countByCriteria(nodes.data, 'up', false) : null;
  const operatorsIssues = hasClusterOperators ? countByCriteria(operators.data, 'condition', operatorsStatuses.FAILING) : null;
  const resourceUsageIssues = hasResourceUsageData
    ? resourceUsageIssuesSelector(cpu, memory, thresholds.DANGER) : null;

  // Sum all issues
  return {
    count: alertsIssues + nodesIssues + resourceUsageIssues + operatorsIssues,
    alerts: alertsIssues,
    nodes: nodesIssues,
    resourceUsage: resourceUsageIssues,
    operators: operatorsIssues,
  };
};

export {
  lastCheckInSelector,
  resourceUsageIssuesSelector,
  clusterHealthSelector,
  hasDataSelector,
  issuesSelector,
};
