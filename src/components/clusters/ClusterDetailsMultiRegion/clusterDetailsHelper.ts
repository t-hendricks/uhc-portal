import { goZeroTime } from '~/common/helpers';
import clusterStates, {
  isHibernating,
  isHypershiftCluster,
} from '~/components/clusters/common/clusterStates';
import { ClusterResource, Subscription, SubscriptionCommonFields } from '~/types/accounts_mgmt.v1';
import { Cluster } from '~/types/clusters_mgmt.v1';
import { ClusterFromSubscription, StaticRegionalItems } from '~/types/types';

import staticRegionalInstances from '../../../../mockdata/api/clusters_mgmt/v1/aws_inquiries/static_regional_instances.json';

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

const isMPoolAz = (cluster: Cluster, mpAvailZones: number | undefined): boolean => {
  // Checks if it is multizone cluster and multi zone machinepool
  if (
    (isMultiAZ(cluster) && mpAvailZones && mpAvailZones > 1) ||
    (isMultiAZ(cluster) && !mpAvailZones)
  ) {
    return true;
  }
  return false;
};

const regionalInstanceUrl = (region: string) => {
  const regionalInstances = staticRegionalInstances as StaticRegionalItems;
  const instance =
    regionalInstances[region as keyof StaticRegionalItems] || regionalInstances.global;

  return instance?.url;
};

/**
 *
 * @param cluster something extending ClusterFromSubscription since components are using either Cluster or ClusterFromSubscription
 * @returns whether subscription is archived or not
 */
const isArchivedSubscription = <E extends ClusterFromSubscription>(cluster: E): boolean =>
  cluster.subscription?.status === SubscriptionCommonFields.status.ARCHIVED ||
  cluster.subscription?.status === SubscriptionCommonFields.status.DEPROVISIONED;

/**
 *
 * @param cluster - something extending ClusterFromSubscription since components are using either Cluster or ClusterFromSubscription
 * @param needsConsoleUrl - flag indicating if a console url must be present
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
  hasValidStatusForActions(cluster, false);

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
  eventTypes,
  getSubscriptionLastReconciledDate,
  hasCpuAndMemory,
  isArchivedSubscription,
  isHypershiftCluster,
  isMPoolAz,
  isMultiAZ,
  regionalInstanceUrl,
  isReadyForAwsAccessActions,
  isReadyForIdpActions,
  isReadyForRoleAccessActions,
};
