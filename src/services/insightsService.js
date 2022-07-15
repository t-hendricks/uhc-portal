import apiRequest from './apiRequest';
import config from '../config';

/* osd_eligible set to true returns only rules that are
dedicated for managed (not only OSD) clusters */
const getClusterInsights = clusterId => apiRequest({
  method: 'get',
  url: `/cluster/${clusterId}/reports`,
  baseURL: `${config.configData.insightsGateway}/insights-results-aggregator/v2`,
});

const getOrganizationInsights = () => apiRequest({
  method: 'get',
  url: '/org_overview',
  baseURL: `${config.configData.insightsGateway}/insights-results-aggregator/v1`,
});

const insigthsService = {
  getClusterInsights,
  getOrganizationInsights,
};

export default insigthsService;
