import { connect } from 'react-redux';
import get from 'lodash/get';

import Monitoring from './Monitoring';
import { clearMonitoringState } from './MonitoringActions';
import {
  issuesSelector,
  lastCheckInSelector,
  resourceUsageIssuesSelector,
  clusterHealthSelector,
  hasDataSelector,
  hasCpuAndMemory,
} from './MonitoringSelectors';

const mapDispatchToProps = {
  clearMonitoringState,
};

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const { alerts, nodes, operators } = state.monitoring;

  const cpu = get(state, 'clusters.details.cluster.metrics.cpu', null);
  const memory = get(state, 'clusters.details.cluster.metrics.memory', null);

  const hasAlerts = hasDataSelector(alerts);
  const hasNodes = hasDataSelector(nodes);
  const hasClusterOperators = hasDataSelector(operators);
  const hasResourceUsageData = hasCpuAndMemory(cpu, memory);

  const alertsIssues = hasAlerts ? issuesSelector(alerts.data, 'severity', 'critical') : null;
  const nodesIssues = hasNodes ? issuesSelector(nodes.data, 'up', false) : null;
  const operatorsIssues = hasClusterOperators ? issuesSelector(operators.data, 'condition', 'failing') : null;
  const resourceUsageIssues = hasResourceUsageData
    ? resourceUsageIssuesSelector(cpu, memory) : null;

  const discoveredIssues = alertsIssues + nodesIssues + resourceUsageIssues + operatorsIssues;

  const lastCheckIn = lastCheckInSelector(cluster.activity_timestamp);

  const healthStatus = clusterHealthSelector(cluster, lastCheckIn, discoveredIssues);

  return ({
    alerts: { ...alerts, numOfIssues: alertsIssues, hasData: hasAlerts },
    nodes: { ...nodes, numOfIssues: nodesIssues, hasData: hasNodes },
    operators: { ...operators, numOfIssues: operatorsIssues, hasData: hasClusterOperators },
    resourceUsage: { numOfIssues: resourceUsageIssues, hasData: hasResourceUsageData },
    lastCheckIn: lastCheckIn.message,
    discoveredIssues,
    healthStatus,
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(Monitoring);
