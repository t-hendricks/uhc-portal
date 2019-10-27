import { connect } from 'react-redux';
import get from 'lodash/get';

import Monitoring from './Monitoring';
import { clearMonitoringState } from './MonitoringActions';
import {
  issuesSelector, lastCheckInSelector, resourceUsageIssuesSelector, clusterHealthSelector,
} from './MonitoringSelectors';

const mapDispatchToProps = {
  clearMonitoringState,
};

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const { alerts, nodes, operators } = state.monitoring;

  const cpu = get(state, 'clusters.details.cluster.metrics.cpu', null);
  const memory = get(state, 'clusters.details.cluster.metrics.memory', null);

  const alertsIssues = issuesSelector(alerts.data, 'severity', 'critical');
  const nodesIssues = issuesSelector(nodes.data, 'up', false);
  const lastCheckIn = lastCheckInSelector(cluster.activity_timestamp);
  const resourceUsageIssues = resourceUsageIssuesSelector(cpu, memory);
  const operatorsIssues = issuesSelector(operators.data, 'condition', 'failing');
  const discoveredIssues = (alertsIssues + nodesIssues + resourceUsageIssues) || null;
  const healthStatus = clusterHealthSelector(
    cluster,
    lastCheckIn,
    nodes.data,
    alerts.data,
    cpu,
    memory,
    alertsIssues,
    nodesIssues,
    resourceUsageIssues,
  );

  return ({
    nodes: { ...nodes, numOfIssues: nodesIssues },
    alerts: { ...alerts, numOfIssues: alertsIssues },
    operators: { ...operators, numOfIssues: operatorsIssues },
    lastCheckIn: lastCheckIn.message,
    resourceUsage: { numOfIssues: resourceUsageIssues },
    discoveredIssues,
    healthStatus,
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(Monitoring);
