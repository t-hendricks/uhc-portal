import { connect } from 'react-redux';

import Monitoring from './Monitoring';
import { clearMonitoringState } from './MonitoringActions';

import {
  lastCheckInSelector,
  clusterHealthSelector,
  issuesAndWarningsSelector,
} from './MonitoringSelectors';
import { hasData, hasResourceUsageMetrics } from './monitoringHelper';

const mapDispatchToProps = {
  clearMonitoringState,
};

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const { alerts, nodes, operators } = state.monitoring;

  const issuesAndWarnings = issuesAndWarningsSelector(state);
  const { issues, warnings } = issuesAndWarnings;

  const totalIssuesCount = issuesAndWarnings.issues.totalCount;
  const lastCheckIn = lastCheckInSelector(state);
  const healthStatus = clusterHealthSelector(state, lastCheckIn, totalIssuesCount);

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
    discoveredIssues: issues.totalCount,
    lastCheckIn,
    healthStatus,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Monitoring);
