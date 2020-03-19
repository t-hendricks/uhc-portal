import apiRequest from './apiRequest';

const getClusterHistory = (externalClusterID, params) => apiRequest({
  method: 'get',
  params: {
    size: params.page_size,
    page: params.page,
    orderBy: params.order,
    search: params.filter,
    query: params.query,
    format: params.format,
  },
  url: '/api/service_logs/v1/cluster_logs/',
});

const serviceLogService = {
  getClusterHistory,
};

export default serviceLogService;
