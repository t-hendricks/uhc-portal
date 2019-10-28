import get from 'lodash/get';

import { monitoringStatuses } from './statusHelper';
import clusterStates from '../../../common/clusterStates';
import { subscriptionStatuses } from '../../../../../common/subscriptionTypes';

// Get the number of issues from a set of data
// An item is considered an issue if it's value of the health criteria mathces the value
// of the definition of issue for this data.
// Example: An Alert has an issues if alert's severity is crtitical.
// Therefore:  issuesSelector(alerts, 'severity', 'crtitical' )
const issuesSelector = (data, healtCriteria, isIssue) => (data.length > 0 ? (
  data.filter(item => item[healtCriteria] === isIssue)
).length : null);

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
  const totalCPU = cpu.total.value;
  const totalMemory = memory.total.value;
  const cpuTimeStampEmpty = new Date(cpu.updated_timestamp).getTime() < 0;
  const memoryTimeStampEmpty = new Date(memory.updated_timestamp).getTime() < 0;

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

const clusterHealthSelector = (
  cluster, lastCheckIn, nodes, alerts, cpu, memory, alertsIssues, nodesIssues, resourceUsageIssues,
) => {
  const { hours, minutes } = lastCheckIn;

  const noFreshActivity = hours > 3 || (hours === 3 && minutes > 0);
  const noData = !alerts
  || !alerts.length
   || !nodes
   || !nodes.length
   || !hasCpuAndMemory(cpu, memory);

  if (cluster.state === clusterStates.INSTALLING || cluster.state === clusterStates.PENDING) {
    return monitoringStatuses.INSTALLING;
  }

  if (get(cluster, 'subscription.status', false) === subscriptionStatuses.DISCONNECTED) {
    return monitoringStatuses.DISCONNECTED;
  }

  if (noFreshActivity || noData) {
    return monitoringStatuses.NO_METRICS;
  }

  if (alertsIssues > 0 || nodesIssues > 0 || resourceUsageIssues > 0) {
    return monitoringStatuses.HAS_ISSUES;
  }

  return monitoringStatuses.HEALTHY;
};

export {
  issuesSelector,
  lastCheckInSelector,
  resourceUsageIssuesSelector,
  clusterHealthSelector,
};
