import { has, get } from 'lodash';
import { normalizedProducts } from '~/common/subscriptionTypes';

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

export { hasCpuAndMemory, getSubscriptionLastReconciledDate, isHypershiftCluster };
