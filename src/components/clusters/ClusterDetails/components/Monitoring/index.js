import { connect } from 'react-redux';
import get from 'lodash/get';

import Monitoring from './Monitoring';
import { clearMonitoringState } from './MonitoringActions';

import {
  lastCheckInSelector,
  resourceUsageIssuesSelector,
  clusterHealthSelector,
  issuesSelector,
} from './MonitoringSelectors';
import {
  countByCriteria,
  alertsSeverity,
  operatorsStatuses,
  thresholds,
} from './monitoringHelper';

const mapDispatchToProps = {
  clearMonitoringState,
};

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const { alerts, nodes, operators } = state.monitoring;

  const cpu = get(state, 'clusters.details.cluster.metrics.cpu', null);
  const memory = get(state, 'clusters.details.cluster.metrics.memory', null);

  const issues = issuesSelector(state);

  const hasAlerts = issues.alerts !== null;
  const hasClusterOperators = issues.operators !== null;
  const hasResourceUsageData = issues.resourceUsage !== null;

  // Calculate warnings
  const alertsWarnings = hasAlerts ? countByCriteria(alerts.data, 'severity', alertsSeverity.WARNING) : null;
  const operatorsWarnings = hasClusterOperators ? countByCriteria(operators.data, 'condition', operatorsStatuses.DEGRADED) : null;
  const resourceUsageWarnings = hasResourceUsageData
    ? resourceUsageIssuesSelector(cpu, memory, thresholds.WARNING) : null;

  const lastCheckIn = lastCheckInSelector(cluster.activity_timestamp);

  // Get overall cluster health status
  const healthStatus = clusterHealthSelector(cluster, lastCheckIn, issues.count);

  return ({
    alerts: {
      ...alerts,
      numOfIssues: issues.alerts,
      numOfWarnings: alertsWarnings,
      hasData: hasAlerts,
    },
    nodes: {
      ...nodes,
      numOfIssues: issues.nodes,
      hasData: !!(issues.nodes),
    },
    operators: {
      ...operators,
      numOfIssues: issues.operators,
      numOfWarnings: operatorsWarnings,
      hasData: hasClusterOperators,
    },
    resourceUsage: {
      numOfIssues: issues.resourceUsage,
      numOfWarnings: resourceUsageWarnings,
      hasData: hasResourceUsageData,
    },
    lastCheckIn: lastCheckIn.message,
    discoveredIssues: issues.count,
    healthStatus,
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(Monitoring);
