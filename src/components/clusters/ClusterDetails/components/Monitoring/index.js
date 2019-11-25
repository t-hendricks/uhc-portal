import { connect } from 'react-redux';
import get from 'lodash/get';

import Monitoring from './Monitoring';
import { clearMonitoringState } from './MonitoringActions';
import hasCpuAndMemory from '../../clusterDetailsHelper';
import {
  issuesSelector,
  lastCheckInSelector,
  resourceUsageIssuesSelector,
  clusterHealthSelector,
  hasDataSelector,
} from './MonitoringSelectors';
import { alertsSeverity, operatorsStatuses, thresholds } from './monitoringHelper';

const mapDispatchToProps = {
  clearMonitoringState,
};

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const { alerts, nodes, operators } = state.monitoring;

  const cpu = get(state, 'clusters.details.cluster.metrics.cpu', null);
  const memory = get(state, 'clusters.details.cluster.metrics.memory', null);

  // For each entity, check if there is data available
  const hasAlerts = hasDataSelector(alerts);
  const hasNodes = hasDataSelector(nodes);
  const hasClusterOperators = hasDataSelector(operators);
  const hasResourceUsageData = hasCpuAndMemory(cpu, memory);

  // Calculate the number of issues
  const alertsIssues = hasAlerts ? issuesSelector(alerts.data, 'severity', alertsSeverity.CRITICAL) : null;
  const nodesIssues = hasNodes ? issuesSelector(nodes.data, 'up', false) : null;
  const operatorsIssues = hasClusterOperators ? issuesSelector(operators.data, 'condition', operatorsStatuses.FAILING) : null;
  const resourceUsageIssues = hasResourceUsageData
    ? resourceUsageIssuesSelector(cpu, memory, thresholds.DANGER) : null;

  // Sum all issues
  const discoveredIssues = alertsIssues + nodesIssues + resourceUsageIssues + operatorsIssues;

  // Calculate the number of warnings
  const alertsWarnings = hasAlerts ? issuesSelector(alerts.data, 'severity', alertsSeverity.WARNING) : null;
  const operatorsWarnings = hasClusterOperators ? issuesSelector(operators.data, 'condition', operatorsStatuses.DEGRADED) : null;
  const resourceUsageWarnings = hasResourceUsageData
    ? resourceUsageIssuesSelector(cpu, memory, thresholds.WARNING) : null;

  const lastCheckIn = lastCheckInSelector(cluster.activity_timestamp);

  // Get overall cluster health status
  const healthStatus = clusterHealthSelector(cluster, lastCheckIn, discoveredIssues);

  return ({
    alerts: {
      ...alerts,
      numOfIssues: alertsIssues,
      numOfWarnings: alertsWarnings,
      hasData: hasAlerts,
    },
    nodes: {
      ...nodes,
      numOfIssues: nodesIssues,
      hasData: hasNodes,
    },
    operators: {
      ...operators,
      numOfIssues: operatorsIssues,
      numOfWarnings: operatorsWarnings,
      hasData: hasClusterOperators,
    },
    resourceUsage: {
      numOfIssues: resourceUsageIssues,
      numOfWarnings: resourceUsageWarnings,
      hasData: hasResourceUsageData,
    },
    lastCheckIn: lastCheckIn.message,
    discoveredIssues,
    healthStatus,
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(Monitoring);
