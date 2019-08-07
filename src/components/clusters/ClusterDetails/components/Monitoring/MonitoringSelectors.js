
import { statuses } from './statusHelper';
import clusterStates from '../../../common/clusterStates';

// Get the number of issues from a set of data
// An item is considered an issue if it's value of the health criteria mathces the value
// of the definition of issue for this data.
// Example: An Alert has an issues if alert's severity is crtitical.
// Therefore:  issuesSelector(alerts, 'severity', 'crtitical' )
const issuesSelector = (data, healtCriteria, isIssue) => (
  data.filter(item => item[healtCriteria] === isIssue)
).length;

const lastCheckInSelector = (lastCheckIn) => {
  const maxDiffDays = 2;
  const date = new Date(lastCheckIn);

  if (date.getTime() > 0) {
    // clculate time delta
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    // calculate time delta in hours
    const hours = Math.floor(diff / 1000 / 60 / 60);
    // calculate time delta in minutes
    const minutes = Math.floor(diff / 1000 / 60);
    // more then 3 hours -> not healty
    // const isHealty = hours > 3 && minutes > 0;

    const values = { hours, minutes };

    if (hours > maxDiffDays * 24) {
      return {
        ...values,
        message: `more then ${maxDiffDays} days ago`,
      };
    } if (hours) {
      return {
        ...values,
        message: hours === 1 ? 'one hour ago' : `${hours} hours ago`,
      };
    } if (minutes) {
      return {
        ...values,
        message: minutes === 1 ? 'one minutes ago' : `${minutes} minutes ago`,
      };
    }
  }
  return {
    value: null,
    unit: null,
    message: 'unknown',
  };
};

const resourceUsageIssuesSelector = (cpu, memory) => {
  const totalCPU = cpu.total.value;
  const totalMemory = cpu.total.value;

  if ((!cpu && !memory) || (!totalCPU && !totalMemory)) {
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
  cluster, lastCheckIn, alertsIssues, nodesIssues, resourceUsageIssues,
) => {
  const { hours, minutes } = lastCheckIn;
  const noMetrics = (hours > 3 && minutes > 0);

  if ((cluster.disconnected && !cluster.managed)
      || cluster.status === clusterStates.INSTALLING
      || noMetrics
  ) {
    return statuses.UNKNOWN;
  }

  if (alertsIssues > 0 || nodesIssues > 0 || resourceUsageIssues > 0) {
    return statuses.HAS_ISSUES;
  }
  return statuses.HEALTHY;
};

export {
  issuesSelector,
  lastCheckInSelector,
  resourceUsageIssuesSelector,
  clusterHealthSelector,
};
