import clusterStates, {
  isHibernating,
  isHypershiftCluster,
} from '~/components/clusters/common/clusterStates';

import { goZeroTime } from '~/common/helpers';
import { subscriptionStatuses } from '~/common/subscriptionTypes';
import { ClusterResource, Subscription } from '~/types/accounts_mgmt.v1';
import { Cluster } from '~/types/clusters_mgmt.v1';
import { ClusterFromSubscription } from '~/types/types';

const hasCpuAndMemory = (cpu: ClusterResource | undefined, memory: ClusterResource | undefined) =>
  !(
    !cpu ||
    !memory ||
    (cpu?.updated_timestamp && new Date(cpu.updated_timestamp).getTime() < 0) ||
    (memory?.updated_timestamp && new Date(memory.updated_timestamp).getTime() < 0) ||
    cpu?.total.value === undefined ||
    memory?.total.value === undefined
  );

const getSubscriptionLastReconciledDate = (subscription: Subscription) =>
  subscription.last_reconcile_date && subscription.last_reconcile_date !== goZeroTime
    ? new Date(subscription.last_reconcile_date).toLocaleString()
    : false;

const isMultiAZ = (cluster: Cluster): boolean =>
  !isHypershiftCluster(cluster) && cluster.multi_az === true;

/**
 *
 * @param cluster something extending ClusterFromSubscription since components are using either Cluster or ClusterFromSubscription
 * @returns whether subscription is archived or not
 */
const isArchivedSubscription = <E extends ClusterFromSubscription>(cluster: E): boolean =>
  cluster.subscription?.status === subscriptionStatuses.ARCHIVED ||
  cluster.subscription?.status === subscriptionStatuses.DEPROVISIONED;

/**
 *
 * @param cluster something extending ClusterFromSubscription since components are using either Cluster or ClusterFromSubscription
 */
const hasValidStatusForActions = <E extends ClusterFromSubscription>(
  cluster: E,
  needsConsoleUrl?: boolean,
): boolean =>
  cluster.managed === true &&
  (!needsConsoleUrl || !['', undefined].includes(cluster.console?.url)) &&
  (cluster.state === clusterStates.READY || isHibernating(cluster)) &&
  !isArchivedSubscription(cluster);

/**
 *
 * @param cluster something extending ClusterFromSubscription since components are using either Cluster or ClusterFromSubscription
 */
const isReadyForRoleAccessActions = <E extends ClusterFromSubscription>(cluster: E): boolean =>
  hasValidStatusForActions(cluster, true);

/**
 *
 * @param cluster something extending ClusterFromSubscription since components are using either Cluster or ClusterFromSubscription
 */
const isReadyForAwsAccessActions = <E extends ClusterFromSubscription>(cluster: E): boolean =>
  isReadyForRoleAccessActions(cluster) &&
  cluster.cloud_provider?.id === 'aws' &&
  !cluster.ccs?.enabled;

/**
 *
 * @param cluster something extending ClusterFromSubscription since components are using either Cluster or ClusterFromSubscription
 */
const isReadyForIdpActions = <E extends ClusterFromSubscription>(cluster: E): boolean =>
  hasValidStatusForActions(cluster, !isHypershiftCluster(cluster));

const eventTypes = {
  CLICKED: 'clicked',
  AUTO: 'auto',
  NONE: '',
};

export {
  hasCpuAndMemory,
  getSubscriptionLastReconciledDate,
  isHypershiftCluster,
  isMultiAZ,
  isArchivedSubscription,
  isReadyForRoleAccessActions,
  isReadyForAwsAccessActions,
  isReadyForIdpActions,
  eventTypes,
};
