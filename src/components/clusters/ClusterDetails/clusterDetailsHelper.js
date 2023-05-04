import { has, get } from 'lodash';
import { normalizedProducts, subscriptionStatuses } from '~/common/subscriptionTypes';
import clusterStates, { isHibernating } from '~/components/clusters/common/clusterStates';

const hasCpuAndMemory = (cpu, memory) => {
  const totalCPU = has(cpu, 'total.value');
  const totalMemory = has(memory, 'total.value');
  const cpuTimeStampEmpty =
    has(cpu, 'updated_timestamp') && new Date(cpu.updated_timestamp).getTime() < 0;
  const memoryTimeStampEmpty =
    has(memory, 'updated_timestamp') && new Date(memory.updated_timestamp).getTime() < 0;

  if (!cpu || !memory || cpuTimeStampEmpty || memoryTimeStampEmpty || !totalCPU || !totalMemory) {
    return false;
  }
  return true;
};

const zeroTime = '0001-01-01T00:00:00Z';

const getSubscriptionLastReconciledDate = (subscription) =>
  get(subscription, 'last_reconcile_date', zeroTime) !== zeroTime
    ? new Date(get(subscription, 'last_reconcile_date')).toLocaleString()
    : false;

const isHypershiftCluster = (cluster) =>
  get(cluster, 'hypershift.enabled', false) ||
  get(cluster, 'subscription.plan.id') === normalizedProducts.ROSA_HyperShift;

const isMultiAZ = (cluster) => !isHypershiftCluster(cluster) && get(cluster, 'multi_az', false);

const isArchivedSubscription = (cluster) => {
  const status = get(cluster, 'subscription.status', '');
  return status === subscriptionStatuses.ARCHIVED || status === subscriptionStatuses.DEPROVISIONED;
};

const hasValidStatusForActions = (cluster, { needsConsoleUrl }) =>
  cluster.managed &&
  (!needsConsoleUrl || get(cluster, 'console.url')) &&
  (cluster.state === clusterStates.READY || isHibernating(cluster.state)) &&
  !isArchivedSubscription(cluster);

const isReadyForRoleAccessActions = (cluster) =>
  hasValidStatusForActions(cluster, { needsConsoleUrl: true });

const isReadyForAwsAccessActions = (cluster) =>
  hasValidStatusForActions(cluster, { needsConsoleUrl: true }) &&
  get(cluster, 'cloud_provider.id') === 'aws' &&
  !get(cluster, 'ccs.enabled', false);

const isReadyForIdpActions = (cluster) =>
  hasValidStatusForActions(cluster, { needsConsoleUrl: !isHypershiftCluster(cluster) });

export {
  hasCpuAndMemory,
  getSubscriptionLastReconciledDate,
  isHypershiftCluster,
  isMultiAZ,
  isArchivedSubscription,
  isReadyForRoleAccessActions,
  isReadyForAwsAccessActions,
  isReadyForIdpActions,
};
