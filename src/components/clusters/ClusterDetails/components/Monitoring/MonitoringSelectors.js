import get from 'lodash/get';
import has from 'lodash/has';

import { monitoringStatuses } from './statusHelper';
import clusterStates from '../../../common/clusterStates';
import { subscriptionStatuses } from '../../../../../common/subscriptionTypes';

/**
 * Get the number of issues from a set of data
 * An item is considered an issue if it's value of the health criteria mathces the value
 * of the definition of issue for this data.
 * Example: An Alert has an issue if alert's severity is crtitical.
 * Therefore:  issuesSelector(alerts, 'severity', 'crtitical' )
 * @param {Object} data
 * @param {string} healthCriteria
 * @param {string} isIssue
 */
const issuesSelector = (data, healthCriteria, isIssue) => data.filter(
  item => item[healthCriteria] === isIssue,
).length;

const lastCheckInSelector = (lastCheckIn) => {
  const maxDiffHours = 3;
  const date = new Date(lastCheckIn);

  if (date.getTime() > 0) {
    // clculate time delta
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    // calculate time delta in hours
    const hours = Math.floor(diff / 1000 / 60 / 60);
    // calculate time delta in minutes
    const minutes = Math.floor(diff / 1000 / 60);
    // more than 3 hours -> not healty

    const values = { hours, minutes };

    if (hours > maxDiffHours) {
      return {
        ...values,
        message: `more than ${maxDiffHours} hours ago`,
      };
    } if (hours) {
      return {
        ...values,
        message: hours === 1 ? 'one hour ago' : `${hours} hours ago`,
      };
    } if (minutes) {
      return {
        ...values,
        message: minutes === 1 ? 'one minute ago' : `${minutes} minutes ago`,
      };
    }
  }
  return {
    value: null,
    unit: null,
    message: 'unknown',
  };
};

const hasCpuAndMemory = (cpu, memory) => {
  const totalCPU = has(cpu, 'total.value');
  const totalMemory = has(memory, 'total.value');
  const cpuTimeStampEmpty = has(cpu, 'updated_timestamp') && new Date(cpu.updated_timestamp).getTime() < 0;
  const memoryTimeStampEmpty = has(memory, 'updated_timestamp') && new Date(memory.updated_timestamp).getTime() < 0;

  if (!cpu || !memory || cpuTimeStampEmpty || memoryTimeStampEmpty || !totalCPU || !totalMemory) {
    return false;
  }
  return true;
};

const resourceUsageIssuesSelector = (cpu, memory) => {
  const totalCPU = cpu.total.value;
  const totalMemory = cpu.total.value;

  if (!hasCpuAndMemory(cpu, memory)) {
    return null;
  }

  let numOfIssues = 0;
  if (cpu && totalCPU && (cpu.used.value / cpu.total.value > 0.95)) {
    numOfIssues += 1;
  }
  if (memory && totalMemory && (memory.used.value / memory.total.value > 0.95)) {
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
 * Returns true if an object has a property named 'data' which is not empty.
 * @param {Object} obj
 */
const hasDataSelector = obj => get(obj, 'data.length', 0) > 0;

export {
  issuesSelector,
  lastCheckInSelector,
  resourceUsageIssuesSelector,
  clusterHealthSelector,
  hasDataSelector,
  hasCpuAndMemory,
};
