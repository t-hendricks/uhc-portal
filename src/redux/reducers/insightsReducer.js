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
import {
  FULFILLED_ACTION,
  setStateProp,
} from '../reduxHelpers';

import { insightsConstants } from '../constants';

const initialState = {
  insights: {},
};

function insightsReducer(state = initialState, action) {
  switch (action.type) {
    // GET_CLUSTER_INSIGHTS
    case FULFILLED_ACTION(insightsConstants.GET_CLUSTER_INSIGHTS):
      return setStateProp(
        'insights',
        {
          ...state.insights,
          [action.payload.clusterID]: action.payload.insights,
        },
        {
          state,
          initialState,
        },
      );
    default:
      return state;
  }
}

insightsReducer.initialState = initialState;

export { initialState, insightsReducer };

export default insightsReducer;
