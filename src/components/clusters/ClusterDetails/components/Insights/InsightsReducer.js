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
import produce from 'immer';

import {
  FULFILLED_ACTION,
  REJECTED_ACTION,
  PENDING_ACTION,
} from '../../../../../redux/reduxHelpers';

import {
  GET_CLUSTER_INSIGHTS,
  GET_REPORT_DETAILS,
  SET_REPORT_DETAILS,
  SEND_FEEDBACK_ON_RULE_DISABLE_INSIGHTS,
  GET_ORGANIZATION_INSIGHTS,
  DISABLE_RULE_INSIGHTS,
  ENABLE_RULE_INSIGHTS,
} from './InsightsConstants';

const initialState = {
  insightsData: {},
  groups: {
    groups: [],
    rejected: false,
    pending: false,
    fulfilled: false,
  },
  reportDetails: {
    report: null,
    rejected: false,
    pending: false,
    fulfilled: false,
  },
  sendFeedbackOnRuleDisable: {
    rejected: false,
    pending: false,
    fulfilled: false,
  },
  overview: {
    overview: null,
    rejected: false,
    pending: false,
    fulfilled: false,
  },
  disableRule: {
    rejected: false,
    pending: false,
    fulfilled: false,
  },
};

function insightsReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    switch (action.type) {
      // GET_CLUSTER_INSIGHTS
      case FULFILLED_ACTION(GET_CLUSTER_INSIGHTS):
        draft.insightsData[action.meta.clusterId] = {
          ...action.payload.insightsData,
          status: action.payload.status,
        };
        break;
      case REJECTED_ACTION(GET_CLUSTER_INSIGHTS):
        draft.insightsData[action.meta.clusterId] = {
          status: action.payload.response.status,
        };
        break;
      // GET_REPORT_DETAILS
      case FULFILLED_ACTION(GET_REPORT_DETAILS):
        draft.reportDetails.report = action.payload.data.report;
        draft.reportDetails.fulfilled = true;
        draft.reportDetails.pending = false;
        break;
      case PENDING_ACTION(GET_REPORT_DETAILS):
        draft.reportDetails.pending = true;
        break;
      case REJECTED_ACTION(GET_REPORT_DETAILS):
        draft.reportDetails.rejected = true;
        draft.reportDetails.pending = false;
        break;
      // SEND_FEEDBACK_ON_RULE_DISABLE_INSIGHTS
      case FULFILLED_ACTION(SEND_FEEDBACK_ON_RULE_DISABLE_INSIGHTS):
        draft.sendFeedbackOnRuleDisable.rejected = false;
        draft.sendFeedbackOnRuleDisable.pending = false;
        draft.sendFeedbackOnRuleDisable.fulfilled = true;
        break;
      case PENDING_ACTION(SEND_FEEDBACK_ON_RULE_DISABLE_INSIGHTS):
        draft.sendFeedbackOnRuleDisable.rejected = false;
        draft.sendFeedbackOnRuleDisable.pending = true;
        draft.sendFeedbackOnRuleDisable.fulfilled = false;
        break;
      case REJECTED_ACTION(SEND_FEEDBACK_ON_RULE_DISABLE_INSIGHTS):
        draft.sendFeedbackOnRuleDisable.rejected = true;
        draft.sendFeedbackOnRuleDisable.pending = false;
        draft.sendFeedbackOnRuleDisable.fulfilled = false;
        break;
      // GET_ORGANIZATION_INSIGHTS
      case FULFILLED_ACTION(GET_ORGANIZATION_INSIGHTS):
        draft.overview.overview = action.payload.data.overview;
        draft.overview.fulfilled = true;
        draft.overview.pending = false;
        break;
      case PENDING_ACTION(GET_ORGANIZATION_INSIGHTS):
        draft.overview.pending = true;
        break;
      case REJECTED_ACTION(GET_ORGANIZATION_INSIGHTS):
        draft.overview.rejected = true;
        draft.overview.pending = false;
        break;
      // SET_REPORT_DETAILS
      case SET_REPORT_DETAILS:
        draft.reportDetails.report = action.payload.data.report;
        draft.reportDetails.fulfilled = true;
        draft.reportDetails.pending = false;
        break;
      // DISABLE_RULE_INSIGHTS
      case FULFILLED_ACTION(DISABLE_RULE_INSIGHTS):
        draft.reportDetails.report.disabled = true;
        draft.reportDetails.fulfilled = true;
        draft.reportDetails.pending = false;
        draft.reportDetails.rejected = false;
        break;
      case PENDING_ACTION(DISABLE_RULE_INSIGHTS):
        draft.reportDetails.fulfilled = false;
        draft.reportDetails.pending = true;
        draft.reportDetails.rejected = false;
        break;
      case REJECTED_ACTION(DISABLE_RULE_INSIGHTS):
        draft.reportDetails.fulfilled = false;
        draft.reportDetails.pending = false;
        draft.reportDetails.rejected = true;
        break;
      case FULFILLED_ACTION(ENABLE_RULE_INSIGHTS):
        draft.reportDetails.report.disabled = false;
        draft.reportDetails.fulfilled = true;
        draft.reportDetails.pending = false;
        draft.reportDetails.rejected = false;
        break;
      case PENDING_ACTION(ENABLE_RULE_INSIGHTS):
        draft.reportDetails.fulfilled = false;
        draft.reportDetails.pending = true;
        draft.reportDetails.rejected = false;
        break;
      case REJECTED_ACTION(ENABLE_RULE_INSIGHTS):
        draft.reportDetails.fulfilled = false;
        draft.reportDetails.pending = false;
        draft.reportDetails.rejected = true;
        break;
      default:
        break;
    }
  });
}

insightsReducer.initialState = initialState;

export default insightsReducer;
