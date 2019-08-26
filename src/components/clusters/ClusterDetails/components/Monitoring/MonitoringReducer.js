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
import helpers from '../../../../../common/helpers';
import { monitoringConstants } from './MonitoringConstants';

const request = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: false,
};

const initialState = {
  alerts: {
    ...request,
    data: [],
  },
  nodes: {
    ...request,
    data: [],
  },
};

function MonitoringReducer(state = initialState, action) {
  switch (action.type) {
    case helpers.REJECTED_ACTION(monitoringConstants.GET_ALERTS):
      return helpers.setStateProp(
        'alerts',
        helpers.getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(monitoringConstants.GET_ALERTS):
      return helpers.setStateProp(
        'alerts',
        {
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(monitoringConstants.GET_ALERTS):
      return helpers.setStateProp(
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


    case helpers.REJECTED_ACTION(monitoringConstants.GET_NODES):
      return helpers.setStateProp(
        'nodes',
        helpers.getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(monitoringConstants.GET_NODES):
      return helpers.setStateProp(
        'nodes',
        {
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(monitoringConstants.GET_NODES):
      return helpers.setStateProp(
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
    default:
      return state;
  }
}

MonitoringReducer.initialState = initialState;

export { initialState, MonitoringReducer };

export default MonitoringReducer;
