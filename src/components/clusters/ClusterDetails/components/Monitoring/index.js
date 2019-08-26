import { connect } from 'react-redux';
import get from 'lodash/get';

import Monitoring from './Monitoring';
import {
  issuesSelector, lastCheckInSelector, resourceUsageIssuesSelector, clusterHealthSelector,
} from './MonitoringSelectors';

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const { alerts, nodes } = state.monitoring;
  const lastTelemetryDate = cluster.subscriptionInfo.last_telemetry_date;
  const cpu = get(state, 'clusters.details.cluster.metrics.cpu', null);
  const memory = get(state, 'clusters.details.cluster.metrics.memory', null);
  const alertsIssues = issuesSelector(alerts.data, 'severity', 'critical');
  const nodesIssues = issuesSelector(nodes.data, 'up', 0);
  const lastCheckIn = lastCheckInSelector(lastTelemetryDate);
  const resourceUsageIssues = resourceUsageIssuesSelector(cpu, memory);
  const healthStatus = clusterHealthSelector(
    cluster, lastCheckIn, alertsIssues, nodesIssues, resourceUsageIssues,
  );

  return ({
    nodes: { ...nodes, numOfIssues: alertsIssues },
    alerts: { ...alerts, numOfIssues: nodesIssues },
    lastCheckIn: lastCheckIn.message,
    resourceUsage: { numOfIssues: resourceUsageIssues },
    healthStatus,
  });
};

export default connect(mapStateToProps, null)(Monitoring);
