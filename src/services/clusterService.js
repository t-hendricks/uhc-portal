import apiRequest from './apiRequest';

const getClusters = params => apiRequest({
  method: 'get',
  url: '/api/clusters_mgmt/v1/clusters',
  params: {
    page: params.page,
    size: params.page_size,
    order: params.order,
    search: params.filter,
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
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/groups/${groupID}/users/${userID}`,
});

const getMachineTypes = () => apiRequest({
  method: 'get',
  url: '/api/clusters_mgmt/v1/machine_types',
});

const clusterService = {
  getClusters,
  postNewCluster,
  getClusterDetails,
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
};

export default clusterService;
