import { AWSCredentials } from '~/types/types';
import apiRequest from './apiRequest';
import type {
  AddOn,
  AddOnInstallation,
  Version,
  AWSInfrastructureAccessRole,
  AWSInfrastructureAccessRoleGrant,
  Ingress,
  UpgradePolicy,
  UpgradePolicyState,
  MachinePool,
  NodePool,
  CloudVPC,
  KeyRing,
  EncryptionKey,
  CloudRegion,
  VersionGate,
  VersionGateAgreement,
  User,
  MachineType,
  Cluster,
  ClusterStatus,
  Log,
  CloudProvider,
  IdentityProvider,
  Group,
  GCP,
  Flavour,
  LimitedSupportReason,
  OidcConfig,
  InflightCheck,
  ClusterAutoscaler,
  DNSDomain,
} from '../types/clusters_mgmt.v1';
import type { Subscription } from '../types/accounts_mgmt.v1';

const getClusters = (search: string, size: number = -1) =>
  apiRequest.post<{
    /**
     * Retrieved list of clusters.
     */
    items?: Array<Cluster>;
    /**
     * Index of the requested page, where one corresponds to the first page.
     */
    page?: number;
    /**
     * Maximum number of items that will be contained in the returned page.
     */
    size?: number;
    /**
     * Total number of items of the collection that match the search criteria,
     * regardless of the size of the page.
     */
    total?: number;
  }>(
    '/api/clusters_mgmt/v1/clusters?method=get',
    // yes, POST with ?method=get. I know it's weird.
    // the backend does not have a /search endpoint,
    // and we might need to send a query that is longer than the GET length limit
    {
      size,
      search,
    },
  );

const postNewCluster = (params: Cluster) =>
  apiRequest.post<Cluster>('/api/clusters_mgmt/v1/clusters', params);

const getClusterDetails = (clusterID: string) =>
  apiRequest.get<Cluster>(`/api/clusters_mgmt/v1/clusters/${clusterID}`);

const getClusterStatus = (clusterID: string) =>
  apiRequest.get<ClusterStatus>(`/api/clusters_mgmt/v1/clusters/${clusterID}/status`);

const getInflightChecks = (clusterID: string) =>
  apiRequest.get<{
    /**
     * Retrieved list of clusters.
     */
    items?: Array<InflightCheck>;
    /**
     * Index of the requested page, where one corresponds to the first page.
     */
    page?: number;
    /**
     * Maximum number of items that will be contained in the returned page.
     */
    size?: number;
    /**
     * Total number of items of the collection that match the search criteria,
     * regardless of the size of the page.
     */
    total?: number;
  }>(`/api/clusters_mgmt/v1/clusters/${clusterID}/inflight_checks`);

const editCluster = (clusterID: string, data: Cluster) =>
  apiRequest.patch<Cluster>(`/api/clusters_mgmt/v1/clusters/${clusterID}`, data);

const deleteCluster = (clusterID: string) =>
  apiRequest.delete<unknown>(`/api/clusters_mgmt/v1/clusters/${clusterID}`);

const getCloudProviders = () =>
  apiRequest.get<{
    /**
     * Retrieved list of cloud providers.
     * Includes additional `regions` property since `fetchRegions = true`.
     */
    items?: Array<CloudProvider>;
    /**
     * Index of the requested page, where one corresponds to the first page.
     */
    page?: number;
    /**
     * Maximum number of items that will be contained in the returned page.
     */
    size?: number;
    /**
     * Total number of items of the collection that match the search criteria,
     * regardless of the size of the page.
     */
    total?: number;
  }>('/api/clusters_mgmt/v1/cloud_providers', {
    params: {
      size: -1,
      fetchRegions: true,
    },
  });

const getLogs = (clusterID: string, offset: number, logType: 'install' | 'uninstall') =>
  apiRequest.get<Log>(`/api/clusters_mgmt/v1/clusters/${clusterID}/logs/${logType}`, {
    params: {
      offset,
    },
  });

const getIdentityProviders = (clusterID: string) =>
  apiRequest.get<IdentityProvider>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/identity_providers`,
  );

const deleteIdentityProvider = (clusterID: string, idpID: string) =>
  apiRequest.delete<unknown>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/identity_providers/${idpID}`,
  );

const createClusterIdentityProvider = (clusterID: string, data: IdentityProvider) =>
  apiRequest.post<IdentityProvider>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/identity_providers`,
    data,
  );

const editClusterIdentityProvider = (clusterID: string, data: IdentityProvider) =>
  apiRequest.patch<IdentityProvider>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/identity_providers/${data.id}`,
    data,
  );

const getClusterGroupUsers = (clusterID: string) =>
  apiRequest.get<{
    /**
     * Retrieved list of groups.
     */
    items?: Array<Group>;
    /**
     * Index of the requested page, where one corresponds to the first page.
     */
    page?: number;
    /**
     * Number of items contained in the returned page.
     */
    size?: number;
    /**
     * Total number of items of the collection.
     */
    total?: number;
  }>(`/api/clusters_mgmt/v1/clusters/${clusterID}/groups`, {
    params: {
      size: -1,
    },
  });

const addClusterGroupUser = (clusterID: string, groupID: string, userID: string) =>
  apiRequest.post<User>(`/api/clusters_mgmt/v1/clusters/${clusterID}/groups/${groupID}/users`, {
    id: userID,
  });

const deleteClusterGroupUser = (clusterID: string, groupID: string, userID: string) =>
  apiRequest.delete<unknown>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/groups/${groupID}/users/${encodeURIComponent(
      userID,
    )}`,
  );

const getFlavour = (flavourID: string) =>
  apiRequest.get<Flavour>(`/api/clusters_mgmt/v1/flavours/${flavourID}`);

const getMachineTypes = () =>
  apiRequest.get<{
    /**
     * Retrieved list of cloud providers.
     */
    items?: Array<MachineType>;
    /**
     * Index of the requested page, where one corresponds to the first page.
     */
    page?: number;
    /**
     * Maximum number of items that will be contained in the returned page.
     */
    size?: number;
    /**
     * Total number of items of the collection that match the search criteria,
     * regardless of the size of the page.
     */
    total?: number;
  }>('/api/clusters_mgmt/v1/machine_types', {
    params: {
      size: -1,
    },
  });

const getStorageQuotaValues = () =>
  apiRequest.get<{ items: number[] }>('/api/clusters_mgmt/v1/storage_quota_values');

const getLoadBalancerQuotaValues = () =>
  apiRequest.get<{ items: number[] }>('/api/clusters_mgmt/v1/load_balancer_quota_values');

const archiveCluster = (subscriptionID: string) =>
  apiRequest.patch<Subscription>(
    `/api/accounts_mgmt/v1/subscriptions/${subscriptionID}`,
    '{"status":"Archived"}',
  );

const unarchiveCluster = (subscriptionID: string) =>
  apiRequest.patch<Subscription>(
    `/api/accounts_mgmt/v1/subscriptions/${subscriptionID}`,
    '{"status":"Disconnected"}',
  );

const hibernateCluster = (clusterID: string) =>
  apiRequest.post<unknown>(`/api/clusters_mgmt/v1/clusters/${clusterID}/hibernate`);

const resumeCluster = (clusterID: string) =>
  apiRequest.post<unknown>(`/api/clusters_mgmt/v1/clusters/${clusterID}/resume`);

type DndDomainsQuery = Partial<{
  userDefined: boolean;
  hasCluster: boolean;
}>;

const getDnsDomains = (query: DndDomainsQuery) => {
  const search = `user_defined='${query.userDefined}' AND cluster.id${
    query.hasCluster ? "!=''" : "=''"
  }`;
  return apiRequest.get<{
    /**
     * Retrieved list of add-ons.
     */
    items?: Array<DNSDomain>;
    /**
     * Index of the requested page, where one corresponds to the first page.
     */
    page?: number;
    /**
     * Maximum number of items that will be contained in the returned page.
     */
    size?: number;
    /**
     * Total number of items of the collection that match the search criteria,
     * regardless of the size of the page.
     */
    total?: number;
  }>('/api/clusters_mgmt/v1/dns_domains', {
    params: { search },
  });
};

const createNewDnsDomain = () =>
  apiRequest.post<DNSDomain>('/api/clusters_mgmt/v1/dns_domains', {});

const deleteDnsDomain = (id: string) =>
  apiRequest.delete<unknown>(`/api/clusters_mgmt/v1/dns_domains/${id}`, {});

const getAddOns = (clusterID: string) =>
  apiRequest.get<{
    /**
     * Retrieved list of add-ons.
     */
    items?: Array<AddOn>;
    /**
     * Index of the requested page, where one corresponds to the first page.
     */
    page?: number;
    /**
     * Maximum number of items that will be contained in the returned page.
     */
    size?: number;
    /**
     * Total number of items of the collection that match the search criteria,
     * regardless of the size of the page.
     */
    total?: number;
  }>(`/api/clusters_mgmt/v1/clusters/${clusterID}/addon_inquiries`);

const getClusterAddOns = (clusterID: string) =>
  apiRequest.get<AddOn>(`/api/clusters_mgmt/v1/clusters/${clusterID}/addons`);

const addClusterAddOn = (clusterID: string, data: AddOnInstallation) =>
  apiRequest.post<AddOnInstallation>(`/api/clusters_mgmt/v1/clusters/${clusterID}/addons`, data);

const updateClusterAddOn = (clusterID: string, addOnID: string, data: AddOnInstallation) =>
  apiRequest.patch<AddOnInstallation>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/addons/${addOnID}`,
    data,
  );

const deleteClusterAddOn = (clusterID: string, addOnID: string) =>
  apiRequest.delete<unknown>(`/api/clusters_mgmt/v1/clusters/${clusterID}/addons/${addOnID}`);

const getInstallableVersions = (isRosa: boolean) =>
  apiRequest.get<{
    /**
     * Retrieved list of versions.
     */
    items?: Array<Version>;
    /**
     * Index of the requested page, where one corresponds to the first page.
     */
    page?: number;
    /**
     * Maximum number of items that will be contained in the returned page.
     *
     * Default value is `100`.
     */
    size?: number;
    /**
     * Total number of items of the collection that match the search criteria,
     * regardless of the size of the page.
     */
    total?: number;
  }>('/api/clusters_mgmt/v1/versions/', {
    params: {
      order: 'end_of_life_timestamp desc',
      // Internal users can test other channels via `ocm` CLI, no UI needed.
      // For external users, make sure we only offer stable channel.
      search: `enabled='t' AND channel_group='stable' ${isRosa ? " AND rosa_enabled='t'" : ''}`,
      size: -1,
    },
  });

const getRoles = () =>
  apiRequest.get<{
    /**
     * Retrieved list of roles.
     */
    items?: Array<AWSInfrastructureAccessRole>;
    /**
     * Index of the requested page, where one corresponds to the first page.
     */
    page?: number;
    /**
     * Maximum number of items that will be contained in the returned page.
     */
    size?: number;
    /**
     * Total number of items of the collection that match the search criteria,
     * regardless of the size of the page.
     */
    total?: number;
  }>("/api/clusters_mgmt/v1/aws_infrastructure_access_roles/?search=state='valid'");

const getGrants = (clusterID: string) =>
  apiRequest.get<{
    /**
     * Retrieved list of AWS infrastructure access role grants.
     */
    items?: Array<AWSInfrastructureAccessRoleGrant>;
    /**
     * Index of the requested page, where one corresponds to the first page.
     */
    page?: number;
    /**
     * Maximum number of items that will be contained in the returned page.
     */
    size?: number;
    /**
     * Total number of items of the collection that match the search criteria,
     * regardless of the size of the page.
     */
    total?: number;
  }>(`/api/clusters_mgmt/v1/clusters/${clusterID}/aws_infrastructure_access_role_grants`);

const addGrant = (clusterID: string, roleId: string, arn: string) =>
  apiRequest.post<AWSInfrastructureAccessRoleGrant>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/aws_infrastructure_access_role_grants/`,
    {
      role: {
        id: roleId,
      },
      user_arn: arn,
    },
  );

const deleteGrant = (clusterID: string, grantId: string) =>
  apiRequest.delete<unknown>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/aws_infrastructure_access_role_grants/${grantId}`,
  );

const getIngresses = (clusterID: string) =>
  apiRequest.get<{
    /**
     * Retrieved list of ingresses.
     */
    items?: Array<Ingress>;
    /**
     * Index of the requested page, where one corresponds to the first page.
     */
    page?: number;
    /**
     * Number of items contained in the returned page.
     */
    size?: number;
    /**
     * Total number of items of the collection.
     */
    total?: number;
  }>(`/api/clusters_mgmt/v1/clusters/${clusterID}/ingresses`);

const editIngresses = (clusterID: string, data: Ingress) =>
  apiRequest.patch<Array<Ingress>>(`/api/clusters_mgmt/v1/clusters/${clusterID}/ingresses`, data);

const editIngress = (clusterID: string, routerID: string, data: Ingress) =>
  apiRequest.patch<Ingress>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/ingresses/${routerID}`,
    data,
  );

const addAdditionalIngress = (clusterID: string, data: Ingress) =>
  apiRequest.post<Ingress>(`/api/clusters_mgmt/v1/clusters/${clusterID}/ingresses`, data);

const deleteAdditionalIngress = (clusterID: string, routerID: string) =>
  apiRequest.delete<unknown>(`/api/clusters_mgmt/v1/clusters/${clusterID}/ingresses/${routerID}`);

const postUpgradeSchedule = (clusterID: string, schedule: UpgradePolicy) =>
  apiRequest.post<UpgradePolicy>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/upgrade_policies`,
    schedule,
  );
const postControlPlaneUpgradeSchedule = (clusterID: string, schedule: UpgradePolicy) =>
  apiRequest.post<UpgradePolicy>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/control_plane/upgrade_policies`,
    schedule,
  );

const patchUpgradeSchedule = (clusterID: string, policyID: string, schedule: UpgradePolicy) =>
  apiRequest.patch<UpgradePolicy>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/upgrade_policies/${policyID}`,
    schedule,
  );

const patchControlPlaneUpgradeSchedule = (
  clusterID: string,
  policyID: string,
  schedule: UpgradePolicy,
) =>
  apiRequest.patch<UpgradePolicy>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/control_plane/upgrade_policies/${policyID}`,
    schedule,
  );

const OSDUpgradeType = 'OSD';
const getUpgradeSchedules = (clusterID: string) =>
  apiRequest.get<{
    /**
     * Retrieved list of upgrade policy.
     */
    items?: Array<UpgradePolicy>;
    /**
     * Index of the requested page, where one corresponds to the first page.
     */
    page?: number;
    /**
     * Number of items contained in the returned page.
     */
    size?: number;
    /**
     * Total number of items of the collection.
     */
    total?: number;
  }>(`/api/clusters_mgmt/v1/clusters/${clusterID}/upgrade_policies`, {
    params: {
      search: `upgrade_type='${OSDUpgradeType}'`,
    },
  });

const getControlPlaneUpgradeSchedules = (clusterID: string) =>
  apiRequest.get<{
    /**
     * Retrieves the list of upgrade policies for the control plane.
     */
    items?: Array<UpgradePolicy>;
    /**
     * Index of the requested page, where one corresponds to the first page.
     */
    page?: number;
    /**
     * Number of items contained in the returned page.
     */
    size?: number;
    /**
     * Total number of items of the collection.
     */
    total?: number;
  }>(`/api/clusters_mgmt/v1/clusters/${clusterID}/control_plane/upgrade_policies`, {
    params: {},
  });

const getUpgradeScheduleState = (clusterID: string, policyID: string) =>
  apiRequest.get<UpgradePolicyState>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/upgrade_policies/${policyID}/state`,
  );

const deleteUpgradeSchedule = (clusterID: string, policyID: string) =>
  apiRequest.delete<unknown>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/upgrade_policies/${policyID}`,
  );

const deleteControlPlaneUpgradeSchedule = (clusterID: string, policyID: string) =>
  apiRequest.delete<unknown>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/control_plane/upgrade_policies/${policyID}`,
  );

const getMachinePools = (clusterID: string) =>
  apiRequest.get<{
    /**
     * Retrieved list of machine pools.
     */
    items?: Array<MachinePool>;
    /**
     * Index of the requested page, where one corresponds to the first page.
     */
    page?: number;
    /**
     * Number of items contained in the returned page.
     */
    size?: number;
    /**
     * Total number of items of the collection.
     */
    total?: number;
  }>(`/api/clusters_mgmt/v1/clusters/${clusterID}/machine_pools`);

const getNodePools = (clusterID: string) =>
  apiRequest.get<{
    /**
     * Retrieved list of node pools.
     */
    items?: Array<NodePool>;
    /**
     * Index of the requested page, where one corresponds to the first page.
     */
    page?: number;
    /**
     * Number of items contained in the returned page.
     */
    size?: number;
    /**
     * Total number of items of the collection.
     */
    total?: number;
  }>(`/api/clusters_mgmt/v1/clusters/${clusterID}/node_pools`);

const patchNodePool = (clusterID: string, nodePoolID: string, data: NodePool) =>
  apiRequest.patch<NodePool>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/node_pools/${nodePoolID}`,
    data,
  );

const addMachinePool = (clusterID: string, data: MachinePool) =>
  apiRequest.post<MachinePool>(`/api/clusters_mgmt/v1/clusters/${clusterID}/machine_pools`, data);

const addNodePool = (clusterID: string, data: NodePool) =>
  apiRequest.post<MachinePool>(`/api/clusters_mgmt/v1/clusters/${clusterID}/node_pools`, data);

const scaleMachinePool = (clusterID: string, machinePoolID: string, data: MachinePool) =>
  apiRequest.patch<MachinePool>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/machine_pools/${machinePoolID}`,
    data,
  );

const deleteMachinePool = (clusterID: string, machinePoolID: string) =>
  apiRequest.delete<unknown>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/machine_pools/${machinePoolID}`,
  );

const deleteNodePool = (clusterID: string, nodePoolID: string) =>
  apiRequest.delete<unknown>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/node_pools/${nodePoolID}`,
  );

const getClusterAutoscaler = (clusterID: string) =>
  apiRequest.get<ClusterAutoscaler>(`/api/clusters_mgmt/v1/clusters/${clusterID}/autoscaler`);

const enableClusterAutoscaler = (clusterID: string, autoscaler: ClusterAutoscaler) =>
  apiRequest.post<ClusterAutoscaler>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/autoscaler`,
    autoscaler,
  );

const updateClusterAutoscaler = (clusterID: string, autoscaler: ClusterAutoscaler) =>
  apiRequest.patch<ClusterAutoscaler>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/autoscaler`,
    autoscaler,
  );

const disableClusterAutoscaler = (clusterID: string) =>
  apiRequest.delete<ClusterAutoscaler>(`/api/clusters_mgmt/v1/clusters/${clusterID}/autoscaler`);

const upgradeTrialCluster = (clusterID: string, data: Cluster) =>
  apiRequest.patch<Cluster>(`/api/clusters_mgmt/v1/clusters/${clusterID}`, data);

/**
 * List AWS VPCs for given CCS account.
 *
 * @param credentials {json} an object in the form:
 * `{
 *    account_id: string,
 *    access_key_id: string,
 *    secret_access_key: string,
 *  }`
 * or, when using STS, in the form:
 * `{
 *    account_id: string,
 *    sts: {
 *      role_arn: string
 *    }
 *  }`
 * @param region {string} the region ID.
 * @param {string} [subnet] - Optimization: If provided, only VPC attached to that subnet id will be included.
 */
const listAWSVPCs = (credentials: AWSCredentials, region: string, subnet?: string) =>
  apiRequest.post<{
    /**
     * Retrieved list of cloud VPC.
     */
    items?: Array<CloudVPC>;
    /**
     * Index of the returned page, where one corresponds to the first page. As this
     * collection doesn't support paging the result will always be `1`.
     */
    page?: number;
    /**
     * Number of items that will be contained in the returned page. As this collection
     * doesn't support paging or searching the result will always be the total number of
     * vpcs of the provider.
     */
    size?: number;
    /**
     * Total number of items of the collection that match the search criteria,
     * regardless of the size of the page. As this collection doesn't support paging or
     * searching the result will always be the total number of available vpcs of the provider.
     */
    total?: number;
  }>('/api/clusters_mgmt/v1/aws_inquiries/vpcs', {
    aws: credentials,
    region: {
      id: region,
    },
    subnets: subnet ? [subnet] : undefined,
  });

const listGCPVPCs = (credentials: GCP, region: string) =>
  apiRequest.post<{
    /**
     * Retrieved list of cloud VPC.
     */
    items?: Array<CloudVPC>;
    /**
     * Index of the returned page, where one corresponds to the first page. As this
     * collection doesn't support paging the result will always be `1`.
     */
    page?: number;
    /**
     * Number of items that will be contained in the returned page. As this collection
     * doesn't support paging or searching the result will always be the total number of
     * vpcs of the provider.
     */
    size?: number;
    /**
     * Total number of items of the collection that match the search criteria,
     * regardless of the size of the page. As this collection doesn't support paging or
     * searching the result will always be the total number of available vpcs of the provider.
     */
    total?: number;
  }>('/api/clusters_mgmt/v1/gcp_inquiries/vpcs', {
    gcp: credentials,
    region: {
      id: region,
    },
  });

/** Possible location values depend on region,
 *  see comma-separated kms_location_id from getCloudProviders().
 */
const listGCPKeyRings = (credentials: GCP, location: string) =>
  apiRequest.post<{
    /**
     * Retrieved list of key rings.
     */
    items?: Array<KeyRing>;
    /**
     * Index of the returned page, where one corresponds to the first page. As this
     * collection doesn't support paging the result will always be `1`.
     */
    page?: number;
    /**
     * Number of items that will be contained in the returned page. As this collection
     * doesn't support paging or searching the result will always be the total number of
     * key rings of the provider.
     */
    size?: number;
    /**
     * Total number of items of the collection that match the search criteria,
     * regardless of the size of the page. As this collection doesn't support paging or
     * searching the result will always be the total number of available key rings of the provider.
     */
    total?: number;
  }>('/api/clusters_mgmt/v1/gcp_inquiries/key_rings', {
    gcp: credentials,
    key_location: location,
  });

const listGCPKeys = (credentials: GCP, location: string, ring: string) =>
  apiRequest.post<{
    /**
     * Retrieved list of encryption keys.
     */
    items?: Array<EncryptionKey>;
    /**
     * Index of the returned page, where one corresponds to the first page. As this
     * collection doesn't support paging the result will always be `1`.
     */
    page?: number;
    /**
     * Number of items that will be contained in the returned page. As this collection
     * doesn't support paging or searching the result will always be the total number of
     * regions of the provider.
     */
    size?: number;
    /**
     * Total number of items of the collection that match the search criteria,
     * regardless of the size of the page. As this collection doesn't support paging or
     * searching the result will always be the total number of available regions of the provider.
     */
    total?: number;
  }>('/api/clusters_mgmt/v1/gcp_inquiries/encryption_keys', {
    gcp: credentials,
    key_location: location,
    key_ring_name: ring,
  });

/**
 * List AWS regions for given CCS account.
 * @param {Object} credentials
 * @param {string} [openshiftVersionId] Optional. Exclude regions known to be incompatible
 *   with this version.
 */
const listAWSRegions = (credentials: AWSCredentials, openshiftVersionId?: string) =>
  apiRequest.post<{
    /**
     * Retrieved list of regions.
     */
    items?: Array<CloudRegion>;
    /**
     * Index of the returned page, where one corresponds to the first page. As this
     * collection doesn't support paging the result will always be `1`.
     */
    page?: number;
    /**
     * Number of items that will be contained in the returned page. As this collection
     * doesn't support paging or searching the result will always be the total number of
     * regions of the provider.
     */
    size?: number;
    /**
     * Total number of items of the collection that match the search criteria,
     * regardless of the size of the page. As this collection doesn't support paging or
     * searching the result will always be the total number of available regions of the provider.
     */
    total?: number;
  }>('/api/clusters_mgmt/v1/aws_inquiries/regions', {
    aws: credentials,
    ...(openshiftVersionId && {
      version: {
        id: openshiftVersionId,
      },
    }),
  });

const getUpgradeGates = () =>
  apiRequest.get<{
    /**
     * Retrieved list of version gates.
     */
    items?: Array<VersionGate>;
    /**
     * Index of the requested page, where one corresponds to the first page.
     */
    page?: number;
    /**
     * Maximum number of items that will be contained in the returned page.
     *
     * Default value is `100`.
     */
    size?: number;
    /**
     * Total number of items of the collection that match the search criteria,
     * regardless of the size of the page.
     */
    total?: number;
  }>('/api/clusters_mgmt/v1/version_gates');

const getClusterGateAgreements = (clusterID: string) =>
  apiRequest.get<{
    /**
     * Retrieved list of version gate agreement.
     */
    items?: Array<VersionGateAgreement>;
    /**
     * Index of the requested page, where one corresponds to the first page.
     */
    page?: number;
    /**
     * Number of items contained in the returned page.
     */
    size?: number;
    /**
     * Total number of items of the collection.
     */
    total?: number;
  }>(`/api/clusters_mgmt/v1/clusters/${clusterID}/gate_agreements`);

const postClusterGateAgreement = (clusterID: string, gateId: string) =>
  apiRequest.post<VersionGateAgreement>(
    `/api/clusters_mgmt/v1/clusters/${clusterID}/gate_agreements`,
    { version_gate: { id: gateId } },
  );

const getOperatorRoleCommands = (
  awsAccountID: string,
  clusterID: string,
  installerRoleARN: string,
) =>
  // TODO response type?
  apiRequest.post(`/api/clusters_mgmt/v1/clusters/${clusterID}/sts_commands`, {
    account_id: awsAccountID,
    sts: {
      role_arn: installerRoleARN,
    },
  });

const getOidcConfigurations = (awsAccountID: string) =>
  apiRequest.get<OidcConfig[]>(`/api/clusters_mgmt/v1/oidc_configs`, {
    params: {
      // Managed oidc_configs are reused across the organization. For those, awsAccountID is not set
      // Unmanaged oidc_configs are associated to a particular aws account. For those, awsAccountID must match
      search: `aws.account_id='${awsAccountID}' or aws.account_id=''`,
    },
  });

const getLimitedSupportReasons = (clusterId: string) =>
  apiRequest.get<{
    /**
     * Retrieved list of template.
     */
    items?: Array<LimitedSupportReason>;
    /**
     * Index of the requested page, where one corresponds to the first page.
     */
    page?: number;
    /**
     * Number of items contained in the returned page.
     */
    size?: number;
    /**
     * Total number of items of the collection.
     */
    total?: number;
  }>(`/api/clusters_mgmt/v1/clusters/${clusterId}/limited_support_reasons`);

const clusterService = {
  getClusters,
  postNewCluster,
  getClusterDetails,
  editCluster,
  getCloudProviders,
  deleteCluster,
  getLogs,
  getIdentityProviders,
  createClusterIdentityProvider,
  getClusterGroupUsers,
  addClusterGroupUser,
  deleteClusterGroupUser,
  deleteIdentityProvider,
  getFlavour,
  getMachineTypes,
  archiveCluster,
  hibernateCluster,
  resumeCluster,
  unarchiveCluster,
  getDnsDomains,
  createNewDnsDomain,
  deleteDnsDomain,
  getAddOns,
  getClusterAddOns,
  addClusterAddOn,
  updateClusterAddOn,
  deleteClusterAddOn,
  getStorageQuotaValues,
  getLoadBalancerQuotaValues,
  getRoles,
  getInstallableVersions,
  getGrants,
  addGrant,
  deleteGrant,
  getIngresses,
  editIngresses,
  editIngress,
  addAdditionalIngress,
  deleteAdditionalIngress,
  editClusterIdentityProvider,
  getClusterStatus,
  getInflightChecks,
  getMachinePools,
  getNodePools,
  patchNodePool,
  addMachinePool,
  addNodePool,
  scaleMachinePool,
  deleteMachinePool,
  deleteNodePool,
  getClusterAutoscaler,
  enableClusterAutoscaler,
  disableClusterAutoscaler,
  updateClusterAutoscaler,
  upgradeTrialCluster,
  getUpgradeGates,
  getClusterGateAgreements,
  postClusterGateAgreement,
  getOperatorRoleCommands,
  getLimitedSupportReasons,
  getOidcConfigurations,
};

export {
  postUpgradeSchedule,
  postControlPlaneUpgradeSchedule,
  getUpgradeSchedules,
  getControlPlaneUpgradeSchedules,
  getUpgradeScheduleState,
  deleteUpgradeSchedule,
  deleteControlPlaneUpgradeSchedule,
  patchUpgradeSchedule,
  patchControlPlaneUpgradeSchedule,
  listAWSVPCs,
  listGCPVPCs,
  listGCPKeyRings,
  listGCPKeys,
  listAWSRegions,
};

export default clusterService;
