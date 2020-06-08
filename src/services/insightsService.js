import apiRequest from './apiRequest';
import config from '../config';

const putLikeOnRuleInsights = (clusterID, ruleID) => apiRequest({
  method: 'put',
  url: `/clusters/${clusterID}/rules/${ruleID}/like`,
}, config.configData.insightsGateway);

const putDislikeOnRuleInsights = (clusterID, ruleID) => apiRequest({
  method: 'put',
  url: `/clusters/${clusterID}/rules/${ruleID}/dislike`,
}, config.configData.insightsGateway);

const resetVoteOnRuleInsights = (clusterID, ruleID) => apiRequest({
  method: 'put',
  url: `/clusters/${clusterID}/rules/${ruleID}/reset_vote`,
}, config.configData.insightsGateway);

const getClusterInsights = (clusterId, orgId) => apiRequest({
  method: 'get',
  url: `/report/${orgId}/${clusterId}`,
}, config.configData.insightsGateway);

const disableRuleInsights = (clusterID, ruleID) => apiRequest({
  method: 'put',
  url: `/clusters/${clusterID}/rules/${ruleID}/disable`,
}, config.configData.insightsGateway);

const enableRuleInsights = (clusterID, ruleID) => apiRequest({
  method: 'put',
  url: `/clusters/${clusterID}/rules/${ruleID}/enable`,
}, config.configData.insightsGateway);

const getGroupsInsights = () => apiRequest({
  method: 'get',
  url: '/groups',
}, config.configData.insightsGateway);


const insigthsService = {
  getClusterInsights,
  putLikeOnRuleInsights,
  putDislikeOnRuleInsights,
  resetVoteOnRuleInsights,
  disableRuleInsights,
  enableRuleInsights,
  getGroupsInsights,
};

export default insigthsService;
