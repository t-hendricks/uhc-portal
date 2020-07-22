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

const getClusterInsights = clusterId => insightsAPIRequest({
  method: 'get',
  url: `/clusters/${clusterId}/report`,
});

const disableRuleInsights = (clusterID, ruleID) => insightsAPIRequest({
  method: 'put',
  url: `/clusters/${clusterID}/rules/${ruleID}/disable`,
});

const getReportDetails = (clusterID, ruleID) => insightsAPIRequest({
  method: 'get',
  url: `/clusters/${clusterID}/rules/${ruleID}/report`,
});

const enableRuleInsights = (clusterID, ruleID) => insightsAPIRequest({
  method: 'put',
  url: `/clusters/${clusterID}/rules/${ruleID}/enable`,
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
  getGroupsInsights,
  getReportDetails,
};

export default insigthsService;
