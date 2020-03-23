import apiRequest from './apiRequest';
import config from '../config';

const putLikeOnRuleInsights = (clusterID, ruleID) => apiRequest({
  method: 'put',
  url: `/api/aggregator/v1/clusters/${clusterID}/rules/${ruleID}/like`,
});

const putDislikeOnRuleInsights = (clusterID, ruleID) => apiRequest({
  method: 'put',
  url: `/api/aggregator/v1/clusters/${clusterID}/rules/${ruleID}/dislike`,
});

const resetVoteOnRuleInsights = (clusterID, ruleID) => apiRequest({
  method: 'put',
  url: `/api/aggregator/v1/clusters/${clusterID}/rules/${ruleID}/reset_vote`,
});

const getClusterInsights = (clusterId, orgId) => apiRequest({
  method: 'get',
  url: `/api/aggregator/v1/report/${orgId}/${clusterId}`,
});


const insigthsService = {
  getClusterInsights,
  putLikeOnRuleInsights,
  putDislikeOnRuleInsights,
  resetVoteOnRuleInsights,
};

export default insigthsService;
