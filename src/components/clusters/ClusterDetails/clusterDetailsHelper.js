import { has, get } from 'lodash';
import moment from 'moment';

import { entitlementStatuses } from '../../../common/subscriptionTypes';


const hasCpuAndMemory = (cpu, memory) => {
  const totalCPU = has(cpu, 'total.value');
  const totalMemory = has(memory, 'total.value');
  const cpuTimeStampEmpty = has(cpu, 'updated_timestamp') && new Date(cpu.updated_timestamp).getTime() < 0;
  const memoryTimeStampEmpty = has(memory, 'updated_timestamp') && new Date(memory.updated_timestamp).getTime() < 0;

  if (!cpu || !memory || cpuTimeStampEmpty || memoryTimeStampEmpty || !totalCPU || !totalMemory) {
    return false;
  }
  return true;
};

const getClusterEvaluationExpiresDate = cluster => (
  get(cluster, 'subscription.entitlement_status', false) === entitlementStatuses.SIXTY_DAY_EVALUATION
    ? moment(cluster.creation_timestamp).add(60, 'days').format('MMMM Do, YYYY')
    : null
);

const getSubscriptionManagementURL = subscription => (
  get(subscription, 'consumer_uuid', false)
    ? `https://access.redhat.com/management/systems/${get(subscription, 'consumer_uuid')}/subscriptions`
    : 'https://access.redhat.com/management/systems'
);

const zeroTime = '0001-01-01T00:00:00Z';

const getSubscriptionLastReconciledDate = subscription => (
  get(subscription, 'last_reconcile_date', zeroTime) !== zeroTime
    ? new Date(get(subscription, 'last_reconcile_date')).toLocaleString()
    : false
);

export {
  hasCpuAndMemory,
  getClusterEvaluationExpiresDate,
  getSubscriptionManagementURL,
  getSubscriptionLastReconciledDate,
};
