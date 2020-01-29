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
  REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION,
  setStateProp, baseRequestState,
} from '../../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../../common/errors';
import { monitoringConstants } from './MonitoringConstants';

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
  switch (action.type) {
    case REJECTED_ACTION(monitoringConstants.GET_ALERTS):
      return setStateProp(
        'alerts',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case PENDING_ACTION(monitoringConstants.GET_ALERTS):
      return setStateProp(
        'alerts',
        {
          data: state.alerts.data,
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case FULFILLED_ACTION(monitoringConstants.GET_ALERTS):
      return setStateProp(
        'alerts',
        {
          data: action.payload.data.alerts,
          pending: false,
          fulfilled: true,
        },
        {
          state,
          initialState,
        },
      );


    case REJECTED_ACTION(monitoringConstants.GET_NODES):
      return setStateProp(
        'nodes',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case PENDING_ACTION(monitoringConstants.GET_NODES):
      return setStateProp(
        'nodes',
        {
          data: state.nodes.data,
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case FULFILLED_ACTION(monitoringConstants.GET_NODES):
      return setStateProp(
        'nodes',
        {
          data: action.payload.data.nodes,
          pending: false,
          fulfilled: true,
        },
        {
          state,
          initialState,
        },
      );


    case REJECTED_ACTION(monitoringConstants.GET_OPERATORS):
      return setStateProp(
        'operators',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case PENDING_ACTION(monitoringConstants.GET_OPERATORS):
      return setStateProp(
        'operators',
        {
          data: state.operators.data,
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case FULFILLED_ACTION(monitoringConstants.GET_OPERATORS):
      return setStateProp(
        'operators',
        {
          data: action.payload.data.operators,
          pending: false,
          fulfilled: true,
        },
        {
          state,
          initialState,
        },
      );


    case monitoringConstants.CLEAR_MONITORING_STATE:
      return initialState;
    default:
      return state;
  }
}

MonitoringReducer.initialState = initialState;

export { initialState, MonitoringReducer };

export default MonitoringReducer;
