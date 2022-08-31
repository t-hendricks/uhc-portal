import { stringify } from 'qs';
import apiRequest from './apiRequest';
import config from '../config';
import type {
  SourcePagination,
  ReportCost,
  UserAccessListPagination,
} from '../types/cost-management.v1';

// Note: API expects params to be formatted as
// ?filter[cluster]=a94ea9bc&filter[cluster]=d37fd94b&group_by[cluster]=*
const getReport = (params?: {
  delta?: string;
  filter?: any;
  orderBy?: any;
  offset?: number;
  limit: number;
  startDate?: string;
  endDate?: string;
}) => {
  const query = {
    ...params,
    filter: {
      limit: 5,
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: '-1',
      ...params?.filter,
    },
    group_by: {
      cluster: '*',
    },
  };

  const queryParams = stringify(query, { encode: false, indices: false });

  return apiRequest.get<ReportCost>(`/cost-management/v1/reports/openshift/costs/?${queryParams}`, {
    baseURL: config.configData.insightsGateway,
    headers: {
      Accept: 'application/json',
    },
  });
};

const getSources = (params?: { type?: string }) =>
  apiRequest.get<SourcePagination>('/cost-management/v1/sources/', {
    baseURL: config.configData.insightsGateway,
    headers: {
      Accept: 'application/json',
    },
    params: {
      type: `${params?.type}`,
    },
  });

const getUserAccess = (params?: { type?: string }) =>
  apiRequest.get<UserAccessListPagination>('/cost-management/v1/user-access/', {
    baseURL: config.configData.insightsGateway,
    headers: {
      Accept: 'application/json',
    },
    params: {
      type: `${params?.type}`,
    },
  });

const costService = {
  getReport,
  getSources,
  getUserAccess,
};

export default costService;
