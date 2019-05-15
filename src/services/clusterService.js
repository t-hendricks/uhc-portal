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

const getClusterCredentials = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/credentials`,
});

const createClusterRouterShard = (clusterID, data) => apiRequest({
  method: 'post',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/router_shards`,
  data,
});

const editClusterRouterShard = (clusterID, routerShardID, data) => apiRequest({
  method: 'patch',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/router_shards/${routerShardID}`,
  data,
});

const deleteClusterRouterShard = (clusterID, routerShardID) => apiRequest({
  method: 'delete',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/router_shards/${routerShardID}`,
});

const getClusterRouterShards = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/router_shards`,
});

const getLogs = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/logs/hive`,
});

const getIdentityProviders = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/identity_providers`,
});

const createClusterIdentityProvider = (clusterID, params) => apiRequest({
  method: 'post',
  url: `/api/clusters_mgmt/v1/clusters/${clusterID}/identity_providers`,
  data: params,
});

const clusterService = {
  getClusters,
  postNewCluster,
  getClusterDetails,
  editCluster,
  getCloudProviders,
  getCloudRegions,
  deleteCluster,
  getClusterCredentials,
  createClusterRouterShard,
  editClusterRouterShard,
  deleteClusterRouterShard,
  getClusterRouterShards,
  getLogs,
  getIdentityProviders,
  createClusterIdentityProvider,
};

export default clusterService;
