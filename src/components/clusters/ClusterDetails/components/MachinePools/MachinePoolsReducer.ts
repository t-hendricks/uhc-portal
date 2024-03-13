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
import { PromiseReducerState } from '~/redux/types';
import { MachinePool, NodePool } from '~/types/clusters_mgmt.v1';
import {
  REJECTED_ACTION,
  PENDING_ACTION,
  FULFILLED_ACTION,
  baseRequestState,
} from '../../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../../common/errors';
import {
  GET_MACHINE_POOLS,
  DELETE_MACHINE_POOL,
  CLEAR_GET_MACHINE_POOLS_RESPONSE,
  CLEAR_DELETE_MACHINE_POOL_RESPONSE,
} from './machinePoolsActionConstants';

type MachinePoolsState = {
  getMachinePools: PromiseReducerState<{ data: (MachinePool | NodePool)[] }>;
  deleteMachinePoolResponse: PromiseReducerState;
};

const initialState: MachinePoolsState = {
  getMachinePools: {
    ...baseRequestState,
    data: [],
  },
  deleteMachinePoolResponse: {
    ...baseRequestState,
  },
};

// eslint-disable-next-line default-param-last
function MachinePoolsReducer(state = initialState, action: any) {
  return produce(state, (draft) => {
    switch (action.type) {
      case PENDING_ACTION(GET_MACHINE_POOLS):
        draft.getMachinePools.pending = true;
        break;

      case FULFILLED_ACTION(GET_MACHINE_POOLS):
        draft.getMachinePools = {
          ...initialState.getMachinePools,
          fulfilled: true,
          error: false,
          data: action.payload.data?.items || [],
        };
        break;

      case REJECTED_ACTION(GET_MACHINE_POOLS):
        draft.getMachinePools = {
          ...initialState.getMachinePools,
          ...getErrorState(action),
        };
        break;

      // CLEAR_GET_MACHINE_POOLS_RESPONSE
      case CLEAR_GET_MACHINE_POOLS_RESPONSE:
        draft.getMachinePools = { ...initialState.getMachinePools };
        break;

      // DELETE_MACHINE_POOL
      case PENDING_ACTION(DELETE_MACHINE_POOL):
        draft.deleteMachinePoolResponse.pending = true;
        break;

      case FULFILLED_ACTION(DELETE_MACHINE_POOL):
        draft.deleteMachinePoolResponse = {
          ...initialState.deleteMachinePoolResponse,
          fulfilled: true,
          error: false,
        };
        break;

      case REJECTED_ACTION(DELETE_MACHINE_POOL):
        draft.deleteMachinePoolResponse = {
          ...initialState.deleteMachinePoolResponse,
          ...getErrorState(action),
        };
        break;

      case CLEAR_DELETE_MACHINE_POOL_RESPONSE:
        draft.deleteMachinePoolResponse = { ...initialState.deleteMachinePoolResponse };
        break;

      default:
        break;
    }
  });
}

MachinePoolsReducer.initialState = initialState;

export { initialState, MachinePoolsReducer };

export default MachinePoolsReducer;
