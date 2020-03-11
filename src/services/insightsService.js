import apiRequest from './apiRequest';

const getClusterInsights = clusterID => apiRequest({
  method: 'get',
  url: `/api/clusters_mgmt/v1/insights/${clusterID}`,
});

const insigthsService = {
  getClusterInsights,
};

export default insigthsService;
