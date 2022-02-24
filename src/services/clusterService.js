import apiRequest from './apiRequest';

const getClusters = search => apiRequest({
  method: 'post',
  url: '/api/clusters_mgmt/v1/clusters?method=get',
  // yes, POST with ?method=get. I know it's weird.
  // the backend does not have a /search endpoint,
  // and we might need to send a query that is longer than the GET length limit
  data: {
    size: -1,
    search,
  },
});

const postNewCluster = params => apiRequest({
  method: 'post',
  url: '/api/clusters_mgmt/v1/clusters',
  data: params,
});

const getClusterDetails = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}`,
});

const getClusterStatus = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/status`,
});

const editCluster = (id, data) => apiRequest({
  method: 'patch',
  url: `/api/clusters_mgmt/v1/clusters/${id}`,
  data,
});

const deleteCluster = id => apiRequest({
  method: 'delete',
  url: `/api/clusters_mgmt/v1/clusters/${id}`,
});

const getCloudProviders = () => apiRequest({
  method: 'get',
  params: {
    size: -1,
    fetchRegions: true,
  },
  url: '/api/clusters_mgmt/v1/cloud_providers',
});

const getLogs = (clusterID, offset, logType) => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/logs/${logType}`,
  params: {
    offset,
  },
});

const getIdentityProviders = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/identity_providers`,
});

const deleteIdentityProvider = (clusterID, idpID) => apiRequest({
  method: 'delete',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/identity_providers/${idpID}`,
});

const createClusterIdentityProvider = (clusterID, params) => apiRequest({
  method: 'post',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/identity_providers`,
  data: params,
});

const editClusterIdentityProvider = (clusterID, params) => apiRequest({
  method: 'patch',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/identity_providers/${params.id}`,
  data: params,
});

const getClusterGroupUsers = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/groups`,
  params: {
    size: -1,
  },
});

const addClusterGroupUser = (clusterID, groupID, userID) => apiRequest({
  method: 'post',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/groups/${groupID}/users`,
  data: {
    id: userID,
  },
});

const deleteClusterGroupUser = (clusterID, groupID, userID) => apiRequest({
  method: 'delete',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/groups/${groupID}/users/${encodeURIComponent(userID)}`,
});

const getMachineTypes = () => apiRequest({
  method: 'get',
  url: '/api/clusters_mgmt/v1/machine_types',
});

const getStorageQuotaValues = () => apiRequest({
  method: 'get',
  url: '/api/clusters_mgmt/v1/storage_quota_values',
});

const getLoadBalancerQuotaValues = () => apiRequest({
  method: 'get',
  url: '/api/clusters_mgmt/v1/load_balancer_quota_values',
});

const archiveCluster = id => apiRequest({
  method: 'patch',
  url: `/api/accounts_mgmt/v1/subscriptions/${id}`,
  data: '{"status":"Archived"}',
});

const unarchiveCluster = id => apiRequest({
  method: 'patch',
  url: `/api/accounts_mgmt/v1/subscriptions/${id}`,
  data: '{"status":"Disconnected"}',
});

const hibernateCluster = id => apiRequest({
  method: 'post',
  url: `/api/clusters_mgmt/v1/clusters/${id}/hibernate`,
});

const resumeCluster = id => apiRequest({
  method: 'post',
  url: `/api/clusters_mgmt/v1/clusters/${id}/resume`,
});

const getDashboard = id => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/dashboards/${id}`,
});

const getAddOns = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/addon_inquiries`,
});

const getClusterAddOns = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/addons`,
});

const addClusterAddOn = (clusterID, data) => apiRequest({
  method: 'post',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/addons`,
  data,
});

const updateClusterAddOn = (clusterID, addOnID, data) => apiRequest({
  method: 'patch',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/addons/${addOnID}`,
  data,
});

const deleteClusterAddOn = (clusterID, addOnID) => apiRequest({
  method: 'delete',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/addons/${addOnID}`,
});

const getInstallableVersions = isRosa => apiRequest({
  method: 'get',
  url: '/api/clusters_mgmt/v1/versions/',
  params: {
    order: 'end_of_life_timestamp desc',
    // Internal users can test other channels via `ocm` CLI, no UI needed.
    // For external users, make sure we only offer stable channel.
    search: `enabled='t' AND channel_group='stable' ${isRosa ? " AND rosa_enabled='t'" : ''}`,
    size: -1,
  },
});

const getRoles = () => apiRequest({
  method: 'get',
  url: '/api/clusters_mgmt/v1/aws_infrastructure_access_roles/?search=state=\'valid\'',
});

const getGrants = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/aws_infrastructure_access_role_grants`,
});

const addGrant = (clusterID, roleId, arn) => apiRequest({
  method: 'post',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/aws_infrastructure_access_role_grants/`,
  data: {
    role: {
      id: roleId,
    },
    user_arn: arn,
  },
});

const deleteGrant = (clusterID, grantId) => apiRequest({
  method: 'delete',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/aws_infrastructure_access_role_grants/${grantId}`,
});

const getIngresses = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/ingresses`,
});

const editIngresses = (clusterID, data) => apiRequest({
  method: 'patch',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/ingresses`,
  data,
});

const editIngress = (clusterID, routerID, data) => apiRequest({
  method: 'patch',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/ingresses/${routerID}`,
  data,
});

const addAdditionalIngress = (clusterID, data) => apiRequest({
  method: 'post',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/ingresses`,
  data,
});

const deleteAdditionalIngress = (clusterID, routerID) => apiRequest({
  method: 'delete',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/ingresses/${routerID}`,
});

const postUpgradeSchedule = (clusterID, schedule) => apiRequest({
  method: 'post',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/upgrade_policies`,
  data: schedule,
});

const patchUpgradeSchedule = (clusterID, policyID, schedule) => apiRequest({
  method: 'patch',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/upgrade_policies/${policyID}`,
  data: schedule,
});

const OSDUpgradeType = 'OSD';
const getUpgradeSchedules = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/upgrade_policies`,
  params: {
    search: `upgrade_type='${OSDUpgradeType}'`,
  },
});

const getUpgradeScheduleState = (clusterID, policyID) => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/upgrade_policies/${policyID}/state`,
});

const deleteUpgradeSchedule = (clusterID, policyID) => apiRequest({
  method: 'delete',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/upgrade_policies/${policyID}`,
});

const getMachinePools = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/machine_pools`,
});

const addMachinePool = (clusterID, params) => apiRequest({
  method: 'post',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/machine_pools`,
  data: params,
});

const scaleMachinePool = (clusterID, machinePoolID, params) => apiRequest({
  method: 'patch',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/machine_pools/${machinePoolID}`,
  data: params,
});

const deleteMachinePool = (clusterID, machinePoolID) => apiRequest({
  method: 'delete',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/machine_pools/${machinePoolID}`,
});

const upgradeTrialCluster = (clusterID, params) => apiRequest({
  method: 'patch',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}`,
  data: params,
});

/**
 * List AWS VPCs for given CCS account.
 * @param {*} credentials { accountID, accessKey, secretKey } object
 */
const listAWSVPCs = (credentials, region) => apiRequest({
  method: 'post',
  url: '/api/clusters_mgmt/v1/aws_inquiries/vpcs',
  data: {
    aws: credentials,
    region: {
      id: region,
    },
  },
});

const listGCPVPCs = (credentials, region) => apiRequest({
  method: 'post',
  url: '/api/clusters_mgmt/v1/gcp_inquiries/vpcs',
  data: {
    gcp: credentials,
    region: {
      id: region,
    },
  },
});

/** Possible location values depend on region,
 *  see comma-separated kms_location_id from getCloudProviders().
 */
const listGCPKeyRings = (credentials, location) => apiRequest({
  method: 'post',
  url: '/api/clusters_mgmt/v1/gcp_inquiries/key_rings',
  data: {
    gcp: credentials,
    key_location: location,
  },
});

const listGCPKeys = (credentials, location, ring) => apiRequest({
  method: 'post',
  url: '/api/clusters_mgmt/v1/gcp_inquiries/encryption_keys',
  data: {
    gcp: credentials,
    key_location: location,
    key_ring_name: ring,
  },
});

/**
 * List AWS regions for given CCS account.
 * @param {*} credentials { accountID, accessKey, secretKey } object
 */
const listAWSRegions = credentials => apiRequest({
  method: 'post',
  url: '/api/clusters_mgmt/v1/aws_inquiries/regions',
  data: {
    aws: credentials,
  },
});

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
  getMachineTypes,
  archiveCluster,
  hibernateCluster,
  resumeCluster,
  unarchiveCluster,
  getAddOns,
  getDashboard,
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
  getMachinePools,
  addMachinePool,
  scaleMachinePool,
  deleteMachinePool,
  upgradeTrialCluster,
};
export {
  postUpgradeSchedule,
  getUpgradeSchedules,
  getUpgradeScheduleState,
  deleteUpgradeSchedule,
  patchUpgradeSchedule,
  listAWSVPCs,
  listGCPVPCs,
  listGCPKeyRings,
  listGCPKeys,
  listAWSRegions,
};

export default clusterService;
