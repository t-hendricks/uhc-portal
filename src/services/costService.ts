import { stringify } from 'qs';
import apiRequest from './apiRequest';
import config from '../config';

// Note: API expects params to be formatted as
// ?filter[cluster]=a94ea9bc&filter[cluster]=d37fd94b&group_by[cluster]=*
const getReport = (params = {}) => {
  const query = {
    ...params,
    filter: {
      limit: 5,
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: '-1',
      ...params.filter,
    },
    group_by: {
      cluster: '*',
    },
  };
  const queryParams = stringify(query, { encode: false, indices: false });

  return apiRequest({
    baseURL: config.configData.insightsGateway,
    headers: {
      Accept: 'application/json',
    },
    method: 'get',
    url: `/cost-management/v1/reports/openshift/costs/?${queryParams}`,
  });
};

const getSources = (params = {}) => apiRequest({
  baseURL: config.configData.insightsGateway,
  headers: {
    Accept: 'application/json',
  },
  method: 'get',
  url: '/cost-management/v1/sources/',
  params: {
    type: `${params.type}`,
  },
});

const getUserAccess = (params = {}) => apiRequest({
  baseURL: config.configData.insightsGateway,
  headers: {
    Accept: 'application/json',
  },
  method: 'get',
  url: '/cost-management/v1/user-access/',
  params: {
    type: `${params.type}`,
  },
});

const costService = {
  getReport,
  getSources,
  getUserAccess,
};

export default costService;
