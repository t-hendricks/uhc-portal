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
  REJECTED_ACTION,
  PENDING_ACTION,
  FULFILLED_ACTION,
  baseRequestState,
} from '../../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../../common/errors';
import monitoringConstants from './MonitoringConstants';

const initialState = {
  alerts: {
    ...baseRequestState,
    data: [],
  },
  nodes: {
    ...baseRequestState,
    data: [],
  },
  operators: {
    ...baseRequestState,
    data: [],
  },
};

function MonitoringReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      // GET_ONDEMAND_METRICS
      case REJECTED_ACTION(monitoringConstants.GET_ONDEMAND_METRICS):
        draft.alerts = {
          ...initialState.alerts,
          ...getErrorState(action),
        };
        draft.nodes = {
          ...initialState.nodes,
          ...getErrorState(action),
        };
        draft.operators = {
          ...initialState.operators,
          ...getErrorState(action),
        };
        break;

      case PENDING_ACTION(monitoringConstants.GET_ONDEMAND_METRICS):
        draft.alerts.pending = true;
        draft.operators.pending = true;
        draft.nodes.pending = true;
        break;

      case FULFILLED_ACTION(monitoringConstants.GET_ONDEMAND_METRICS):
        draft.alerts = {
          ...initialState.alerts,
          fulfilled: true,
          data: action.payload.data.alerts,
        };
        draft.nodes = {
          ...initialState.nodes,
          fulfilled: true,
          data: action.payload.data.nodes,
        };
        draft.operators = {
          ...initialState.operators,
          fulfilled: true,
          data: action.payload.data.cluster_operators,
        };
        break;

      // CLEAR_MONITORING_STATE
      case monitoringConstants.CLEAR_MONITORING_STATE:
        return initialState;
    }
  });
}

MonitoringReducer.initialState = initialState;

export { initialState, MonitoringReducer };

export default MonitoringReducer;
