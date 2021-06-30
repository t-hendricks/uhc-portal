import get from 'lodash/get';

import config from '../../../../../config';
import {
  getIssuesAndWarnings,
  monitoringStatuses,
  alertsSeverity,
  operatorsStatuses,
  thresholds,
  resourceUsageIssuesHelper,
  maxMetricsTimeDelta,
} from './monitoringHelper';
import { subscriptionStatuses } from '../../../../../common/subscriptionTypes';

// returns a Date.
const lastCheckInSelector = (state) => {
  const timestamp = get(state, 'clusters.details.cluster.activity_timestamp', '0001-01-01');
  return new Date(timestamp);
};

const invalidDate = date => date.toString().includes('0001-01-01');

const clusterHealthSelector = (state, lastCheckIn, discoveredIssues) => {
  const cluster = get(state, 'clusters.details.cluster', null);
  if (!cluster) {
    return monitoringStatuses.NO_METRICS;
  }

  const diff = new Date().getTime() - lastCheckIn.getTime();
  const hours = diff / 1000 / 60 / 60;
  const showOldMetrics = !!config.configData.showOldMetrics;
  const freshActivity = showOldMetrics || hours < maxMetricsTimeDelta;

  if (invalidDate(lastCheckIn)) {
    return monitoringStatuses.UNKNOWN;
  }

  if (get(cluster, 'subscription.status', false) === subscriptionStatuses.DISCONNECTED) {
    return monitoringStatuses.DISCONNECTED;
  }

  if (!freshActivity) {
    return monitoringStatuses.NO_METRICS;
  }

  if (cluster.metrics.upgrade.state === 'running') {
    return monitoringStatuses.UPGRADING;
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
