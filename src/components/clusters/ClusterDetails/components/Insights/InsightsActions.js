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

import get from 'lodash/get';
import {
  GET_CLUSTER_INSIGHTS,
  VOTE_ON_RULE_INSIGHTS,
  DISABLE_RULE_INSIGHTS,
  ENABLE_RULE_INSIGHTS,
  SEND_FEEDBACK_ON_RULE_DISABLE_INSIGHTS,
  GET_REPORT_DETAILS,
  SET_REPORT_DETAILS,
  GET_ORGANIZATION_INSIGHTS,
} from './InsightsConstants';
import { accountsService, insightsService } from '../../../../../services';

export const setReportDetails = report => ({
  type: SET_REPORT_DETAILS,
  payload: report,
});

const fetchSingleClusterInsights = (clusterId, isOSD) => insightsService
  .getClusterInsights(clusterId, isOSD)
  .then(response => ({
    insightsData: get(response, 'data.report', {}),
    clusterId,
    status: response.status,
  }));

export const fetchClusterInsights = (clusterId, isOSD) => dispatch => dispatch({
  type: GET_CLUSTER_INSIGHTS,
  payload: fetchSingleClusterInsights(clusterId, isOSD),
  meta: {
    clusterId,
  },
});

// clusterId is id of the cluster
// ruleId is id of the rule
// vote is integer: -1(dislike), 0(reset_vote), 1(like)
const voteOnSingleRuleInsights = async (dispatch, clusterId, ruleId, errorKey, vote) => {
  let response;
  switch (vote) {
    case -1:
      response = await insightsService.putDislikeOnRuleInsights(clusterId, ruleId, errorKey);
      break;
    case 0:
      response = await insightsService.resetVoteOnRuleInsights(clusterId, ruleId, errorKey);
      break;
    case 1:
      response = await insightsService.putLikeOnRuleInsights(clusterId, ruleId, errorKey);
      break;
    default:
      throw Error(`unsupported vote ${vote}`);
  }

  dispatch(fetchClusterInsights(clusterId));

  return {
    insightsData: response.data,
    clusterId,
    ruleId,
    vote,
  };
};

export const voteOnRuleInsights = (clusterId, ruleId, errorKey, vote) => dispatch => dispatch({
  type: VOTE_ON_RULE_INSIGHTS,
  payload: voteOnSingleRuleInsights(dispatch, clusterId, ruleId, errorKey, vote),
});

// clusterId is id of the cluster
// ruleId is id of the rule
const toggleSingleRuleInsights = async (dispatch, clusterId, ruleId, errorKey, enable) => {
  const action = enable ? insightsService.enableRuleInsights : insightsService.disableRuleInsights;
  const response = action(clusterId, ruleId, errorKey).then((resp) => {
    dispatch(fetchClusterInsights(clusterId));

    return resp;
  });

  return {
    insightsData: response.data,
    clusterId,
    ruleId,
  };
};

// clusterId is id of the cluster
// ruleId is id of the rule
// feedback is feedback on rule
const sendFeedbackOnSingleRuleDisableInsights = async (clusterId, ruleId, errorKey, feedback) => {
  const response = await insightsService.sendFeedbackOnRuleDisableInsights(
    clusterId, ruleId, errorKey, feedback,
  );

  return {
    insightsData: response.data,
    clusterId,
    ruleId,
  };
};

export const disableRuleInsights = (clusterId, ruleId, errorKey) => dispatch => (
  dispatch({
    type: DISABLE_RULE_INSIGHTS,
    payload: toggleSingleRuleInsights(dispatch, clusterId, ruleId, errorKey, false),
  })
);

export const enableRuleInsights = (clusterId, ruleId, errorKey) => dispatch => (
  dispatch({
    type: ENABLE_RULE_INSIGHTS,
    payload: toggleSingleRuleInsights(dispatch, clusterId, ruleId, errorKey, true),
  })
);

export const sendFeedbackOnRuleDisableInsights = (
  clusterId, ruleId, errorKey, feedback,
) => dispatch => (
  dispatch(
    {
      type: SEND_FEEDBACK_ON_RULE_DISABLE_INSIGHTS,
      payload: sendFeedbackOnSingleRuleDisableInsights(clusterId, ruleId, errorKey, feedback),
    },
  )
);

export const fetchReportDetails = (clusterId, ruleId, errorKey, isOSD) => dispatch => dispatch({
  type: GET_REPORT_DETAILS,
  payload: insightsService.getReportDetails(clusterId, ruleId, errorKey, isOSD),
});

const fetchClusterIds = orgId => accountsService.getSubscriptions({
  page_size: -1,
  fields: 'external_cluster_id',
  filter: `organization_id = '${orgId}' and status NOT IN ('Deprovisioned', 'Archived')`,
});

export const fetchOrganizationInsights = orgId => dispatch => dispatch({
  type: GET_ORGANIZATION_INSIGHTS,
  payload: fetchClusterIds(orgId).then((response) => {
    const externalClusterIds = get(response, 'data.items', null);
    if (!externalClusterIds) {
      return Promise.reject();
    }
    return insightsService.getOrganizationInsights(externalClusterIds
      .map(item => item.external_cluster_id).filter(Boolean));
  }),
});
