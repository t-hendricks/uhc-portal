import get from 'lodash/get';

import {
  getIssuesAndWarnings,
  monitoringStatuses,
  alertsSeverity,
  operatorsStatuses,
  thresholds,
  resourceUsageIssuesHelper,
} from './monitoringHelper';
import clusterStates from '../../../common/clusterStates';
import { subscriptionStatuses } from '../../../../../common/subscriptionTypes';


const lastCheckInSelector = (state) => {
  const lastCheckIn = get(state, 'clusters.details.cluster.activity_timestamp', '');

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

const clusterHealthSelector = (state, lastCheckIn, discoveredIssues) => {
  const cluster = get(state, 'clusters.details.cluster', null);
  const { hours, minutes } = lastCheckIn;

  const noFreshActivity = hours > 3 || (hours === 3 && minutes > 0) || !cluster;

  if (!cluster.managed && (get(cluster, 'subscription.status', false) === subscriptionStatuses.DISCONNECTED)) {
    return monitoringStatuses.DISCONNECTED;
  }

  if (noFreshActivity) {
    return monitoringStatuses.NO_METRICS;
  }

  if (cluster.metrics.upgrade.state === 'running') {
    return monitoringStatuses.UPGRADING;
  }

  if (cluster.state === clusterStates.INSTALLING || cluster.state === clusterStates.PENDING) {
    return monitoringStatuses.INSTALLING;
  }

  if (discoveredIssues > 0) {
    return monitoringStatuses.HAS_ISSUES;
  }

  return monitoringStatuses.HEALTHY;
};


const issuesAndWarningsSelector = (state) => {
  const { alerts, nodes, operators } = state.monitoring;

  const cpu = get(state, 'clusters.details.cluster.metrics.cpu', null);
  const memory = get(state, 'clusters.details.cluster.metrics.memory', null);

  const alertsIssuesAndWarnings = getIssuesAndWarnings({
    data: alerts.data,
    criteria: 'severity',
    issuesMatch: alertsSeverity.CRITICAL,
    warningsMatch: alertsSeverity.WARNING,
  });

  const nodesIssues = getIssuesAndWarnings({
    data: nodes.data,
    criteria: 'up',
    issuesMatch: false,
  });

  const operatorsIssuesAndWarnings = getIssuesAndWarnings({
    data: operators.data,
    criteria: 'condition',
    issuesMatch: operatorsStatuses.FAILING,
    warningsMatch: operatorsStatuses.DEGRADED,
  });

  const resourceUsageIssuesAndWarnings = {
    issuesCount: resourceUsageIssuesHelper(cpu, memory, thresholds.DANGER),
    warningsCount: resourceUsageIssuesHelper(cpu, memory, thresholds.WARNING),
  };

  return {
    issues: {
      alerts: alertsIssuesAndWarnings.issuesCount,
      nodes: nodesIssues.issuesCount,
      operators: operatorsIssuesAndWarnings.issuesCount,
      resourceUsage: resourceUsageIssuesAndWarnings.issuesCount,
      totalCount:
        alertsIssuesAndWarnings.issuesCount
        + nodesIssues.issuesCount
        + operatorsIssuesAndWarnings.issuesCount
        + resourceUsageIssuesAndWarnings.issuesCount,
    },
    warnings: {
      alerts: alertsIssuesAndWarnings.warningsCount,
      operators: operatorsIssuesAndWarnings.warningsCount,
      resourceUsage: resourceUsageIssuesAndWarnings.warningsCount,
    },
  };
};

export {
  lastCheckInSelector,
  clusterHealthSelector,
  issuesAndWarningsSelector,
};
