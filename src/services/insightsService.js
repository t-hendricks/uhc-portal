import apiRequest from './apiRequest';
import config from '../config';

const insightsAPIRequest = params => apiRequest({
  ...params,
  baseURL: config.configData.insightsGateway,
});

const putLikeOnRuleInsights = (clusterID, ruleID) => insightsAPIRequest({
  method: 'put',
  url: `/clusters/${clusterID}/rules/${ruleID}/like`,
});

const putDislikeOnRuleInsights = (clusterID, ruleID) => insightsAPIRequest({
  method: 'put',
  url: `/clusters/${clusterID}/rules/${ruleID}/dislike`,
});

const resetVoteOnRuleInsights = (clusterID, ruleID) => insightsAPIRequest({
  method: 'put',
  url: `/clusters/${clusterID}/rules/${ruleID}/reset_vote`,
});

const getClusterInsights = (clusterId, isOSD) => insightsAPIRequest({
  method: 'get',
  url: `/clusters/${clusterId}/report?osd_eligible=${isOSD}`,
});

const disableRuleInsights = (clusterID, ruleID) => insightsAPIRequest({
  method: 'put',
  url: `/clusters/${clusterID}/rules/${ruleID}/disable`,
});

const getReportDetails = (clusterID, ruleID, errorKey, isOSD) => insightsAPIRequest({
  method: 'get',
  url: `/clusters/${clusterID}/rules/${ruleID.replace('.', '%2E')}|${errorKey}/report?osd_eligible=${isOSD}`,
});

const enableRuleInsights = (clusterID, ruleID) => insightsAPIRequest({
  method: 'put',
  url: `/clusters/${clusterID}/rules/${ruleID}/enable`,
});

const sendFeedbackOnRuleDisableInsights = (clusterID, ruleID, message) => insightsAPIRequest({
  method: 'post',
  url: `/clusters/${clusterID}/rules/${ruleID}/disable_feedback`,
  data: { message },
});

const getGroupsInsights = () => insightsAPIRequest({
  method: 'get',
  url: '/groups',
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
};

export default insigthsService;
