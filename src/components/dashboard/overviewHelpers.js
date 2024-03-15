import get from 'lodash/get';

import { hasCpuAndMemory } from '../clusters/ClusterDetails/clusterDetailsHelper';
import {
  hasResourceUsageMetrics,
  thresholds,
  resourceUsageIssuesHelper,
} from '../clusters/ClusterDetails/components/Monitoring/monitoringHelper';

const RULE_SEVERITIES = {
  1: 'Low',
  2: 'Moderate',
  3: 'Important',
  4: 'Critical',
};

const getSeverityName = (num) => RULE_SEVERITIES[num];

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
    ? resourceUsageIssuesHelper(cpu, memory, thresholds.DANGER)
    : 0;

  // Sum all issues
  return clustersAlertsFiringCritical + resourceUsageIssues + clusterOperatorsConditionFailing;
}

const groupTagHitsByGroups = (hits, groups) =>
  groups
    .sort((a, b) => a.title.localeCompare(b.title))
    .reduce(
      (acc, { tags, title }) => ({
        ...acc,
        [title]: {
          count: tags.reduce((num, item) => num + get(hits, item, 0), 0),
          tags: tags.join(','),
        },
      }),
      {},
    );

export { getIssuesCount, groupTagHitsByGroups, getSeverityName };

export default getIssuesCount;
