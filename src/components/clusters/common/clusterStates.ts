import { normalizedProducts } from '~/common/subscriptionTypes';
import { ClusterAuthorizationRequest, SubscriptionCommonFields } from '~/types/accounts_mgmt.v1';
import { Cluster, ClusterState, InflightCheck, InflightCheckState } from '~/types/clusters_mgmt.v1';
import { ClusterFromSubscription, ClusterWithPermissions } from '~/types/types';

enum SubscriptionDerivedStates {
  UPDATING = 'updating',
  DISCONNECTED = 'disconnected',
  DEPROVISIONED = 'deprovisioned',
  ARCHIVED = 'archived',
  STALE = 'stale',
}

// see https://github.com/microsoft/TypeScript/issues/17592
type clusterStates = ClusterState | SubscriptionDerivedStates;
// eslint-disable-next-line no-redeclare
const clusterStates = { ...ClusterState, ...SubscriptionDerivedStates };

export type ClusterStateAndDescription = {
  state?: clusterStates;
  description: string;
};

const getStateDescription = (state?: clusterStates): string => {
  switch (state) {
    case clusterStates.DEPROVISIONED:
      return 'Deleted';
    default:
      return state ? (state.charAt(0).toUpperCase() + state.slice(1)).replace(/_/g, ' ') : '';
  }
};

/**
 *
 * @param cluster something extending ClusterFromSubscription since components are using either Cluster or ClusterFromSubscription
 */
const isClusterUpgrading = <E extends ClusterFromSubscription>(cluster?: E) =>
  cluster?.metrics.upgrade.state === 'running';

const isClusterUpgradeCompleted = <E extends ClusterFromSubscription>(cluster?: E) =>
  cluster?.metrics.upgrade.state === 'completed';

/**
 * This function is not meant to return status of uninstalled OCP-AssistedInstall clusters.
 * To display the status for those, use the component <AIClusterStatus />
 *
 * @param cluster something extending ClusterFromSubscription since components are using either Cluster or ClusterFromSubscription
 */
const getClusterStateAndDescription = <E extends ClusterFromSubscription>(
  cluster: E,
): ClusterStateAndDescription => {
  let state: clusterStates | undefined;

  // the state is determined by subscriptions.status or cluster.state.
  // the conditions are not mutually exclusive and are ordered by priority, e.g., STALE and READY.
  if (cluster.subscription?.status === SubscriptionCommonFields.status.DISCONNECTED) {
    state = clusterStates.DISCONNECTED;
  } else if (cluster.subscription?.status === SubscriptionCommonFields.status.DEPROVISIONED) {
    state = clusterStates.DEPROVISIONED;
  } else if (cluster.subscription?.status === SubscriptionCommonFields.status.ARCHIVED) {
    state = clusterStates.ARCHIVED;
  } else if (
    cluster.state === ClusterState.INSTALLING ||
    cluster.state === ClusterState.VALIDATING ||
    cluster.state === ClusterState.PENDING
  ) {
    state = clusterStates.INSTALLING;
  } else if (cluster.state === ClusterState.WAITING) {
    state = clusterStates.WAITING;
  } else if (cluster.state === ClusterState.UNINSTALLING) {
    state = clusterStates.UNINSTALLING;
  } else if (cluster.state === ClusterState.ERROR) {
    state = clusterStates.ERROR;
  } else if (cluster.state === ClusterState.HIBERNATING) {
    state = clusterStates.HIBERNATING;
  } else if (cluster.state === ClusterState.POWERING_DOWN) {
    state = clusterStates.POWERING_DOWN;
  } else if (cluster.state === ClusterState.RESUMING) {
    state = clusterStates.RESUMING;
  } else if (cluster.subscription?.status === SubscriptionCommonFields.status.STALE) {
    state = clusterStates.STALE;
  } else if (isClusterUpgrading(cluster)) {
    state = clusterStates.UPDATING;
  } else if (
    cluster.subscription?.status === SubscriptionCommonFields.status.ACTIVE ||
    cluster.state === ClusterState.READY
  ) {
    state = clusterStates.READY;
  }

  return {
    state,
    description: getStateDescription(state),
  };
};

/**
 *
 * @param cluster something extending ClusterFromSubscription since components are using either Cluster or ClusterFromSubscription
 */
const getInflightChecks = <E extends ClusterFromSubscription>(cluster?: E): Array<InflightCheck> =>
  cluster && Array.isArray(cluster.inflight_checks) ? cluster.inflight_checks : [];

/**
 *
 * @param cluster something extending ClusterFromSubscription since components are using either Cluster or ClusterFromSubscription
 */
const isHibernating = <E extends ClusterFromSubscription>(cluster: E): boolean =>
  cluster.state === ClusterState.HIBERNATING ||
  cluster.state === ClusterState.POWERING_DOWN ||
  cluster.state === ClusterState.RESUMING;

/**
 *
 * @param cluster something extending ClusterFromSubscription since components are using either Cluster or ClusterFromSubscription
 */
const hasInflightEgressErrors = <E extends ClusterFromSubscription>(cluster: E): boolean =>
  getInflightChecks(cluster).some((inflightCheck) => {
    if (inflightCheck.state !== InflightCheckState.PASSED) {
      const { details = {} } = inflightCheck;
      return Object.keys(details).some(
        (dkey) =>
          dkey.startsWith('subnet') &&
          Object.keys(details[dkey]).some((skey) => skey.startsWith('egress_url_errors')),
      );
    }
    return false;
  });

/**
 * Indicates that this is an OSD cluster
 *
 * @param cluster something extending ClusterFromSubscription since components are using either Cluster or ClusterFromSubscription
 */
const isOSD = <E extends ClusterFromSubscription>(cluster: E): boolean =>
  [normalizedProducts.OSD, normalizedProducts.OSDTRIAL].includes(
    cluster.product?.id! as ClusterAuthorizationRequest.product_id,
  );

/**
 *
 * @param cluster something extending ClusterFromSubscription since components are using either Cluster or ClusterFromSubscription
 */
const isOSDGCPWaitingForRolesOnHostProject = <E extends ClusterFromSubscription>(
  cluster: E,
): boolean => {
  const vpcProjectId = cluster?.gcp_network?.vpc_project_id;
  const statusDescription = cluster?.status?.description;
  return (
    isOSD(cluster) &&
    vpcProjectId !== undefined &&
    statusDescription !== undefined &&
    cluster?.status?.state === ClusterState.WAITING &&
    statusDescription.indexOf(vpcProjectId) > -1
  );
};

/**
 *
 * @param cluster something extending ClusterFromSubscription since components are using either Cluster or ClusterFromSubscription
 */
const isOSDGCPPendingOnHostProject = <E extends ClusterFromSubscription>(cluster: E): boolean =>
  isOSD(cluster) &&
  ['validating', 'pending'].includes(cluster?.status?.state!) &&
  !!cluster?.gcp_network?.vpc_project_id;

/**
 *
 * @param cluster something extending ClusterFromSubscription since components are using either Cluster or ClusterFromSubscription
 */
const isErrorSharedGCPVPCValues = (cluster: ClusterFromSubscription): boolean =>
  isOSD(cluster) &&
  cluster.state === ClusterState.WAITING &&
  !!cluster?.gcp_network?.vpc_project_id &&
  !!cluster?.status?.description &&
  cluster.status.description.includes(cluster.gcp_network.vpc_project_id) &&
  cluster.status.description.includes('Could not validate the shared subnets');

/**
 * Indicates that this is a ROSA cluster
 *
 * @param cluster something extending ClusterFromSubscription since components are using either Cluster or ClusterFromSubscription
 */
const isROSA = <E extends ClusterFromSubscription | Cluster>(cluster?: E): boolean =>
  cluster?.product?.id === normalizedProducts.ROSA;

const isCCS = <E extends ClusterFromSubscription>(cluster: E): boolean =>
  cluster.ccs?.enabled ?? false;

const isAWS = <E extends ClusterFromSubscription>(cluster: E): boolean =>
  cluster.subscription?.cloud_provider_id === 'aws';

const isGCP = <E extends ClusterFromSubscription>(cluster: E): boolean =>
  cluster.cloud_provider?.id === 'gcp';

/**
 * Indicates that this is a ROSA cluster with manual mode
 *
 * @param cluster something extending ClusterFromSubscription since components are using either Cluster or ClusterFromSubscription
 */
const isROSAManualMode = (cluster: ClusterFromSubscription): boolean =>
  isROSA(cluster) && !cluster?.aws?.sts?.auto_mode && !cluster?.aws?.sts?.oidc_config?.id;

const isHypershiftCluster = (cluster?: ClusterFromSubscription | Cluster): boolean =>
  cluster?.hypershift?.enabled ||
  (cluster?.subscription !== undefined &&
    'plan' in cluster.subscription &&
    cluster.subscription.plan?.id === normalizedProducts.ROSA_HyperShift);

// Indicates that cluster is waiting and an oidc_config.id had been specified
const isWaitingForOIDCProviderOrOperatorRolesMode = (cluster: ClusterFromSubscription): boolean =>
  isROSA(cluster) &&
  cluster.state === ClusterState.WAITING &&
  cluster?.aws?.sts?.oidc_config?.id !== undefined;

// Indicates that this is a Waiting Hypershift cluster
const isWaitingHypershiftCluster = (cluster: ClusterFromSubscription): boolean =>
  cluster.state === ClusterState.WAITING && isHypershiftCluster(cluster);

const isWaitingROSAManualMode = (cluster: ClusterFromSubscription): boolean =>
  cluster.state === ClusterState.WAITING &&
  isROSAManualMode(cluster) &&
  !isHypershiftCluster(cluster);

/**
 *
 * @param cluster something extending ClusterFromSubscription since components are using either Cluster or ClusterFromSubscription
 */
const isOffline = <E extends ClusterFromSubscription>(cluster: E): boolean =>
  isHibernating(cluster) || cluster.state === ClusterState.UNINSTALLING;

const getClusterAIPermissions = (cluster: ClusterWithPermissions) => ({
  canEdit: cluster.canEdit,
});

/**
 * Indicates cluster is in a state to show the Machine Pool tab
 *
 * @param cluster  ClusterFromSubscription
 */
const canViewMachinePoolTab = (cluster: ClusterFromSubscription): boolean => {
  const isArchived =
    cluster?.subscription?.status === SubscriptionCommonFields.status.ARCHIVED ||
    cluster?.subscription?.status === SubscriptionCommonFields.status.DEPROVISIONED;

  return (
    (cluster?.managed ?? false) &&
    (cluster?.state === clusterStates.READY || isHibernating(cluster)) &&
    !isArchived
  );
};

const isAWSPrivateCluster = (cluster: ClusterFromSubscription): boolean =>
  (cluster?.aws && cluster?.ccs?.enabled && cluster?.aws?.private_link) ?? false;

export {
  canViewMachinePoolTab,
  getClusterAIPermissions,
  getClusterStateAndDescription,
  getInflightChecks,
  getStateDescription,
  hasInflightEgressErrors,
  isAWS,
  isGCP,
  isAWSPrivateCluster,
  isCCS,
  isClusterUpgradeCompleted,
  isClusterUpgrading,
  isErrorSharedGCPVPCValues,
  isHibernating,
  isHypershiftCluster,
  isOSD,
  isOSDGCPPendingOnHostProject,
  isOSDGCPWaitingForRolesOnHostProject,
  isOffline,
  isROSA,
  isROSAManualMode,
  isWaitingForOIDCProviderOrOperatorRolesMode,
  isWaitingHypershiftCluster,
  isWaitingROSAManualMode,
};

export default clusterStates;
