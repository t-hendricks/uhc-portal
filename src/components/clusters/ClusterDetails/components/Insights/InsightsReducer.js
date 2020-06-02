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

import { GET_CLUSTER_INSIGHTS, GET_GROUPS_INSIGHTS } from './InsightsConstants';

const initialState = {
  insightsData: {},
  groups: {
    groups: [],
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
        draft.insightsData[action.payload.clusterId] = action.payload.insightsData;
        break;
      case REJECTED_ACTION(GET_CLUSTER_INSIGHTS):
        draft.insightsData[action.payload.clusterId] = { status: action.payload.status };
        break;
      case FULFILLED_ACTION(GET_GROUPS_INSIGHTS):
        draft.groups.groups = action.payload.data.groups;
        draft.groups.fulfilled = true;
        draft.groups.pending = false;
        break;
      case PENDING_ACTION(GET_GROUPS_INSIGHTS):
        draft.groups.pending = true;
        break;
      case REJECTED_ACTION(GET_GROUPS_INSIGHTS):
        draft.groups.rejected = true;
        draft.groups.pending = false;
        break;
      default:
        break;
    }
  });
}

insightsReducer.initialState = initialState;

export default insightsReducer;
