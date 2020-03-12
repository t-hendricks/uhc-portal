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

const postDisconnectedCluster = params => apiRequest({
  method: 'post',
  url: '/api/clusters_mgmt/v1/register_disconnected',
  data: params,
});

const getClusterDetails = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}`,
});

const fetchClusterByExternalId = clusterExternalID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters?&search=external_id='${clusterExternalID}'`,
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
    size: 1000,
  },
  url: '/api/clusters_mgmt/v1/cloud_providers',
});

const getCloudRegions = providerID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/cloud_providers/${providerID}/regions`,
});

const getLogs = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/logs/hive`,
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

const getClusterGroupUsers = (clusterID, groupID) => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/groups/${groupID}/users`,
  params: {
    size: 10000,
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

const getAlerts = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/metric_queries/alerts`,
});

const getNodes = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/metric_queries/nodes`,
});

const getClusterOperators = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/metric_queries/cluster_operators`,
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

const getAddOns = () => apiRequest({
  method: 'get',
  url: '/api/clusters_mgmt/v1/addons',
});

const getClusterAddOns = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/addons`,
});

const addClusterAddOn = (clusterID, addOnID) => apiRequest({
  method: 'post',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/addons`,
  data: `{"addon":{"id":"${addOnID}"}}`,
});

const deleteClusterAddOn = (clusterID, addOnID) => apiRequest({
  method: 'delete',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/addons/${addOnID}`,
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

const clusterService = {
  getClusters,
  postNewCluster,
  postDisconnectedCluster,
  getClusterDetails,
  fetchClusterByExternalId,
  editCluster,
  getCloudProviders,
  getCloudRegions,
  deleteCluster,
  getLogs,
  getIdentityProviders,
  createClusterIdentityProvider,
  getClusterGroupUsers,
  addClusterGroupUser,
  deleteClusterGroupUser,
  deleteIdentityProvider,
  getMachineTypes,
  getNodes,
  getAlerts,
  getClusterOperators,
  archiveCluster,
  unarchiveCluster,
  getAddOns,
  getClusterAddOns,
  addClusterAddOn,
  deleteClusterAddOn,
  getStorageQuotaValues,
  getLoadBalancerQuotaValues,
  getRoles,
  getGrants,
  addGrant,
  deleteGrant,
  getIngresses,
  editIngresses,
  editIngress,
  addAdditionalIngress,
  deleteAdditionalIngress,
};

export default clusterService;
