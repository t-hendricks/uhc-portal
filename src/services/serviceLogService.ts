import { Cluster } from '~/types/clusters_mgmt.v1';
import apiRequest from './apiRequest';
import type { ClusterLogList } from '../types/service_logs.v1';

export type GetClusterHistoryParams = {
  page: number;
  ['page_size']: number;
  order?: string;
  filter?: string;
  query?: string;
  format?: string;
  fetchAccounts?: boolean;
};

const getClusterHistory = (
  clusterUUID: Cluster['external_id'],
  clusterID: Cluster['id'],
  params: GetClusterHistoryParams,
) =>
  apiRequest.get<ClusterLogList>(`/api/service_logs/v1/clusters/cluster_logs`, {
    params: {
      cluster_uuid: clusterUUID,
      cluster_id: clusterID,
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
