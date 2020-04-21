import get from 'lodash/get';
import { hasCpuAndMemory } from '../clusters/ClusterDetails/clusterDetailsHelper';
import { hasResourceUsageMetrics, thresholds } from '../clusters/ClusterDetails/components/Monitoring/monitoringHelper';
import { resourceUsageIssuesSelector } from '../clusters/ClusterDetails/components/Monitoring/MonitoringSelectors';

const clustersWithIssuesFilter = "health_state='unhealthy'";

function getIssuesCount(cluster) {
  const metrics = get(cluster, 'metrics', null);
  if (!metrics) {
    return 0;
  }

  const { cpu, memory } = metrics;
  // For each entity, check if there is data available
  const clustersAlertsFiringCritical = get(metrics, 'critical_alerts_firing', 0);
  const clusterOperatorsConditionFailing = get(metrics, 'operators_condition_failing', 0);

  const hasResourceUsageData = hasCpuAndMemory(cpu, memory) && hasResourceUsageMetrics(cluster);
  const resourceUsageIssues = hasResourceUsageData
    ? resourceUsageIssuesSelector(cpu, memory, thresholds.DANGER) : 0;

  // Sum all issues
  return clustersAlertsFiringCritical + resourceUsageIssues + clusterOperatorsConditionFailing;
}

export {
  clustersWithIssuesFilter,
  getIssuesCount,
};

export default getIssuesCount;
