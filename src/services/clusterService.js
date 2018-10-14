import axios from 'axios';
import serviceConfig from './serviceConfig';

const getClusters = params => axios(
  serviceConfig({
    method: 'get',
    url: '/api/clusters_mgmt/v1/clusters',
    params: {
      page: params.page,
      size: params.page_size,
      // sorting
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

const clusterService = {
  getClusters,
  postNewCluster,
  getClusterDetails,
};

export default clusterService;
