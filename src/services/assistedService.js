import apiRequest from './apiRequest';

const getAIClusters = () => apiRequest({
  method: 'get',
  url: '/api/assisted-install/v1/clusters',
});

const getAICluster = clusterID => apiRequest({
  method: 'get',
  url: `/api/assisted-install/v1/clusters/${clusterID}`,
});

const assistedService = {
  getAIClusters,
  getAICluster,
};

export default assistedService;
