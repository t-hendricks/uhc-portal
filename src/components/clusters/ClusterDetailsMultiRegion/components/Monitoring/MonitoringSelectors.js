import { isClusterUpgrading } from '~/components/clusters/common/clusterStates';

import { subscriptionStatuses } from '../../../../../common/subscriptionTypes';
import config from '../../../../../config';

import {
  alertsSeverity,
  getIssuesAndWarnings,
  hasData,
  hasResourceUsageMetrics,
  maxMetricsTimeDelta,
  monitoringStatuses,
  operatorsStatuses,
  resourceUsageIssuesHelper,
  thresholds,
} from './monitoringHelper';

// returns a Date.
const lastCheckInSelector = (cluster) => {
  const timestamp = cluster.activity_timestamp ? cluster.activity_timestamp : '0001-01-01';
  return new Date(timestamp);
};

const invalidDate = (date) => date.getUTCFullYear() <= 1;

const clusterHealthSelector = (cluster, lastCheckIn, discoveredIssues) => {
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

  if (cluster.subscription.status === subscriptionStatuses.DISCONNECTED) {
    return monitoringStatuses.DISCONNECTED;
  }

  if (!freshActivity) {
    return monitoringStatuses.NO_METRICS;
  }
  if (isClusterUpgrading(cluster)) {
    return monitoringStatuses.UPGRADING;
  }

  if (discoveredIssues > 0) {
    return monitoringStatuses.HAS_ISSUES;
  }

  return monitoringStatuses.HEALTHY;
};

const alertsNodesOperatorsSelector = (monitoring, issues, warnings, cluster) => {
  const { alerts, nodes, operators } = monitoring;
  return {
    alerts: {
      ...alerts,
      numOfIssues: issues.alerts,
      numOfWarnings: warnings.alerts,
      hasData: hasData(alerts),
    },
    nodes: {
      ...nodes,
      numOfIssues: issues.nodes,
      hasData: hasData(nodes),
    },
    operators: {
      ...operators,
      numOfIssues: issues.operators,
      numOfWarnings: warnings.operators,
      hasData: hasData(operators),
    },
    resourceUsage: {
      numOfIssues: issues.resourceUsage,
      numOfWarnings: warnings.resourceUsage,
      hasData: hasResourceUsageMetrics(cluster),
    },
  };
};

const issuesAndWarningsSelector = (monitoring, cluster) => {
  const { alerts, nodes, operators } = monitoring;

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
    issuesCount: resourceUsageIssuesHelper(
      cluster?.metrics?.cpu,
      cluster?.metrics?.memory,
      thresholds.DANGER,
    ),
    warningsCount: resourceUsageIssuesHelper(
      cluster?.metrics?.cpu,
      cluster?.metrics?.memory,
      thresholds.WARNING,
    ),
  };

  return {
    issues: {
      alerts: alertsIssuesAndWarnings.issuesCount,
      nodes: nodesIssues.issuesCount,
      operators: operatorsIssuesAndWarnings.issuesCount,
      resourceUsage: resourceUsageIssuesAndWarnings.issuesCount,
      totalCount:
        alertsIssuesAndWarnings.issuesCount +
        nodesIssues.issuesCount +
        operatorsIssuesAndWarnings.issuesCount +
        resourceUsageIssuesAndWarnings.issuesCount,
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
  alertsNodesOperatorsSelector,
};
