import axios from 'axios';
import serviceConfig from './serviceConfig';

const getClusters = params => axios(
  serviceConfig({
    method: 'get',
    url: '/api/clusters_mgmt/v1/clusters',
    params: {
      page: params.page,
      size: params.page_size,
      order: params.order,
      search: params.filter,
    },
  }),
);

const postNewCluster = params => axios(
  serviceConfig({
    method: 'post',
    url: '/api/clusters_mgmt/v1/clusters',
    data: params,
  }),
);

const getClusterDetails = clusterID => axios(
  serviceConfig({
    method: 'get',
    url: `/api/clusters_mgmt/v1/clusters/${clusterID}`,
  }),
);

const editCluster = (id, data) => axios(
  serviceConfig({
    method: 'patch',
    url: `/api/clusters_mgmt/v1/clusters/${id}`,
    data,
  }),
);

const deleteCluster = id => axios(
  serviceConfig({
    method: 'delete',
    url: `/api/clusters_mgmt/v1/clusters/${id}`,
  }),
);

const getCloudProviders = () => axios(
  serviceConfig({
    method: 'get',
    params: {
      size: 1000,
    },
    url: '/api/clusters_mgmt/v1/cloud_providers',
  }),
);

const getCloudRegions = providerID => axios(
  serviceConfig({
    method: 'get',
    url: `/api/clusters_mgmt/v1/cloud_providers/${providerID}/regions`,
  }),
);

const getClusterCredentials = clusterID => axios(
  serviceConfig({
    method: 'get',
    url: `/api/clusters_mgmt/v1/clusters/${clusterID}/credentials`,
  }),
);

const clusterService = {
  getClusters,
  postNewCluster,
  getClusterDetails,
  editCluster,
  getCloudProviders,
  getCloudRegions,
  deleteCluster,
  getClusterCredentials,
};

export default clusterService;
