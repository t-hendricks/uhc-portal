import apiRequest from './apiRequest';
import type { ClusterLogList } from '../types/service_logs.v1';

const getClusterHistory = (
  clusterUUID: string,
  params: {
    page: number;
    ['page_size']: number;
    order?: string;
    filter?: string;
    query?: string;
    format?: string;
    fetchAccounts?: boolean;
  },
) =>
  apiRequest.get<ClusterLogList>(`/api/service_logs/v1/clusters/${clusterUUID}/cluster_logs`, {
    params: {
      size: params.page_size,
      page: params.page,
      orderBy: params.order,
      search: params.filter,
      query: params.query,
      format: params.format,
    },
  });

const serviceLogService = {
  getClusterHistory,
};

export default serviceLogService;
