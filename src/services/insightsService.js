import apiRequest from './apiRequest';
import config from '../config';

const insightsAPIRequest = params => apiRequest({
  ...params,
  baseURL: `${config.configData.insightsGateway}/insights-results-aggregator/v1`,
});

/* osd_eligible set to true returns only rules that are
dedicated for managed (not only OSD) clusters */
const getClusterInsights = (clusterId, isManaged) => insightsAPIRequest({
  method: 'get',
  url: `/clusters/${clusterId}/report?osd_eligible=${isManaged}&get_disabled=false`,
});

const getOrganizationInsights = clusterIds => insightsAPIRequest({
  method: 'post',
  url: '/org_overview',
  data: { clusters: clusterIds },
});

const insigthsService = {
  getClusterInsights,
  getOrganizationInsights,
};

export default insigthsService;
