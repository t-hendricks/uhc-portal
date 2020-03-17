import apiRequest from './apiRequest';

const apiPrefix = '/api/clusters_mgmt/v1/insights';

const getClusterInsights = clusterID => apiRequest({
  method: 'get',
  url: `${apiPrefix}/${clusterID}`,
});

const putLikeOnRuleInsights = (clusterID, ruleID) => apiRequest({
  method: 'put',
  url: `${apiPrefix}/clusters/${clusterID}/rules/${ruleID}/like`,
});

const putDislikeOnRuleInsights = (clusterID, ruleID) => apiRequest({
  method: 'put',
  url: `${apiPrefix}/clusters/${clusterID}/rules/${ruleID}/dislike`,
});

const resetVoteOnRuleInsights = (clusterID, ruleID) => apiRequest({
  method: 'put',
  url: `${apiPrefix}/clusters/${clusterID}/rules/${ruleID}/reset_vote`,
});


const insigthsService = {
  getClusterInsights,
  putLikeOnRuleInsights,
  putDislikeOnRuleInsights,
  resetVoteOnRuleInsights,
};

export default insigthsService;
