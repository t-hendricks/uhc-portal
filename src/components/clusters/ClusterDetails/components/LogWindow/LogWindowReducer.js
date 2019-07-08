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
import { logWindowConstants } from './LogWindowConstants';

const initialState = {
  logs: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    lines: '',
  },
};

function LogsReducer(state = initialState, action) {
  switch (action.type) {
    case helpers.REJECTED_ACTION(logWindowConstants.GET_LOGS):
      return helpers.setStateProp(
        'logs',
        helpers.getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(logWindowConstants.GET_LOGS):
      return helpers.setStateProp(
        'logs',
        {
          pending: true,
          lines: state.logs.lines,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(logWindowConstants.GET_LOGS):
      return helpers.setStateProp(
        'logs',
        {
          lines: action.payload.data.content,
          pending: false,
          fulfilled: true,
        },
        {
          state,
          initialState,
        },
      );

    case logWindowConstants.CLEAR_LOGS:
      return helpers.setStateProp(
        'logs',
        {},
        {
          state,
          initialState,
          reset: true,
        },
      );

    default:
      return state;
  }
}

LogsReducer.initialState = initialState;

export { initialState, LogsReducer };

export default LogsReducer;
