import apiRequest from './apiRequest';
import config from '../config';

const insightsAPIRequest = params => apiRequest({
  ...params,
  baseURL: `${config.configData.insightsGateway}/insights-results-aggregator/v1`,
});

const putLikeOnRuleInsights = (clusterId, ruleId, errorKey) => insightsAPIRequest({
  method: 'put',
  url: `/clusters/${clusterId}/rules/${ruleId}/error_key/${errorKey}/like`,
});

const putDislikeOnRuleInsights = (clusterId, ruleId, errorKey) => insightsAPIRequest({
  method: 'put',
  url: `/clusters/${clusterId}/rules/${ruleId}/error_key/${errorKey}/dislike`,
});

const resetVoteOnRuleInsights = (clusterId, ruleId, errorKey) => insightsAPIRequest({
  method: 'put',
  url: `/clusters/${clusterId}/rules/${ruleId}/error_key/${errorKey}/reset_vote`,
});

const getClusterInsights = (clusterId, isOSD) => insightsAPIRequest({
  method: 'get',
  url: `/clusters/${clusterId}/report?osd_eligible=${isOSD}&get_disabled=true`,
});

const disableRuleInsights = (clusterId, ruleId, errorKey) => insightsAPIRequest({
  method: 'put',
  url: `/clusters/${clusterId}/rules/${ruleId}/error_key/${errorKey}/disable`,
});

const getReportDetails = (clusterId, ruleId, errorKey, isOSD) => insightsAPIRequest({
  method: 'get',
  url: `/clusters/${clusterId}/rules/${ruleId.replace('.', '%2E')}|${errorKey}/report?osd_eligible=${isOSD}`,
});

const enableRuleInsights = (clusterId, ruleId, errorKey) => insightsAPIRequest({
  method: 'put',
  url: `/clusters/${clusterId}/rules/${ruleId}/error_key/${errorKey}/enable`,
});

const sendFeedbackOnRuleDisableInsights = (
  clusterId, ruleId, errorKey, message,
) => insightsAPIRequest({
  method: 'post',
  url: `/clusters/${clusterId}/rules/${ruleId}/error_key/${errorKey}/disable_feedback`,
  data: { message },
});

const getGroupsInsights = () => insightsAPIRequest({
  method: 'get',
  url: '/groups',
});

const getOrganizationInsights = clusterIds => insightsAPIRequest({
  method: 'post',
  url: '/org_overview',
  data: { clusters: clusterIds },
});

const insigthsService = {
  getClusterInsights,
  putLikeOnRuleInsights,
  putDislikeOnRuleInsights,
  resetVoteOnRuleInsights,
  disableRuleInsights,
  enableRuleInsights,
  sendFeedbackOnRuleDisableInsights,
  getGroupsInsights,
  getReportDetails,
  getOrganizationInsights,
};

export default insigthsService;
