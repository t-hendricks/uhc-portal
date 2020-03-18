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
} from '../../../../../redux/reduxHelpers';

import { GET_CLUSTER_INSIGHTS } from './InsightsConstants';

const initialState = {
  insights: {},
};

function insightsReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    switch (action.type) {
      // GET_CLUSTER_INSIGHTS
      case FULFILLED_ACTION(GET_CLUSTER_INSIGHTS):
        draft.insights[action.payload.clusterID] = action.payload.insights;
        break;
      case REJECTED_ACTION(GET_CLUSTER_INSIGHTS):
        draft.insights[action.payload.clusterID] = { status: action.payload.status };
        break;
    }
  });
}

insightsReducer.initialState = initialState;

export default insightsReducer;
