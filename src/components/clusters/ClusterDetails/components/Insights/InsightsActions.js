/*
Copyright (c) 2018 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import { GET_CLUSTER_INSIGHTS, VOTE_ON_RULE_INSIGHTS } from './InsightsConstants';
import { insightsService } from '../../../../../services';

const fetchSingleClusterInsights = async (clusterId) => {
  try {
    const clusterResponse = await insightsService.getClusterInsights(clusterId);
    return {
      insights: clusterResponse.data,
      clusterID: clusterId
    };
  } catch (e) {
    const error = Error('Insights for cluster not found');
    error.status = e.response.status;
    error.clusterID = clusterId;
    throw error;
  }
};

export const fetchClusterInsights = clusterID => dispatch => dispatch({
  type: GET_CLUSTER_INSIGHTS,
  payload: fetchSingleClusterInsights(clusterID),
});

// clusterId is id of the cluster
// ruleId is id of the rule
// vote is integer: -1(dislike), 0(reset_vote), 1(like)
const voteOnSingleRuleInsights = async (clusterId, ruleId, vote) => {
  let response;
  switch (vote) {
    case -1:
      response = insightsService.putDislikeOnRuleInsights(clusterId, ruleId);
      break;
    case 0:
      response = insightsService.resetVoteOnRuleInsights(clusterId, ruleId);
      break;
    case 1:
      response = insightsService.putLikeOnRuleInsights(clusterId, ruleId);
      break;
    default:
      throw Error('unsupported vote');
  }

  return {
    insights: response.data,
    clusterId,
    ruleId,
    vote,
  };
};

export const voteOnRuleInsights = (clusterId, ruleId, vote) => dispatch => dispatch({
  type: VOTE_ON_RULE_INSIGHTS,
  payload: voteOnSingleRuleInsights(clusterId, ruleId, vote),
});
