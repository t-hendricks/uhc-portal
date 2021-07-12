import apiRequest from './apiRequest';
import config from '../config';

const insightsAPIRequest = params => apiRequest({
  ...params,
  baseURL: `${config.configData.insightsGateway}/insights-results-aggregator/v1`,
});

const putLikeOnRuleInsights = (clusterId, ruleId) => insightsAPIRequest({
  method: 'put',
  url: `/clusters/${clusterId}/rules/${ruleId}/like`,
});

const putDislikeOnRuleInsights = (clusterId, ruleId) => insightsAPIRequest({
  method: 'put',
  url: `/clusters/${clusterId}/rules/${ruleId}/dislike`,
});

const resetVoteOnRuleInsights = (clusterId, ruleId) => insightsAPIRequest({
  method: 'put',
  url: `/clusters/${clusterId}/rules/${ruleId}/reset_vote`,
});

const getClusterInsights = (clusterId, isOSD) => insightsAPIRequest({
  method: 'get',
  url: `/clusters/${clusterId}/report?osd_eligible=${isOSD}&get_disabled=true`,
});

const disableRuleInsights = (clusterId, ruleId) => insightsAPIRequest({
  method: 'put',
  url: `/clusters/${clusterId}/rules/${ruleId}/disable`,
});

const getReportDetails = (clusterId, ruleId, errorKey, isOSD) => insightsAPIRequest({
  method: 'get',
  url: `/clusters/${clusterId}/rules/${ruleId.replace('.', '%2E')}|${errorKey}/report?osd_eligible=${isOSD}`,
});

const enableRuleInsights = (clusterId, ruleId) => insightsAPIRequest({
  method: 'put',
  url: `/clusters/${clusterId}/rules/${ruleId}/enable`,
});

const sendFeedbackOnRuleDisableInsights = (clusterId, ruleId, message) => insightsAPIRequest({
  method: 'post',
  url: `/clusters/${clusterId}/rules/${ruleId}/disable_feedback`,
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
