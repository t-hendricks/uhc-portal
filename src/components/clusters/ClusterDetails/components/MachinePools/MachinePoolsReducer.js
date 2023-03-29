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
import {
  GET_MACHINE_POOLS,
  ADD_MACHINE_POOL,
  SCALE_MACHINE_POOL,
  PATCH_NODE_POOL,
  DELETE_MACHINE_POOL,
  CLEAR_ADD_MACHINE_POOL_RESPONSE,
  CLEAR_SCALE_MACHINE_POOL_RESPONSE,
  CLEAR_GET_MACHINE_POOLS_RESPONSE,
  CLEAR_DELETE_MACHINE_POOL_RESPONSE,
} from './MachinePoolsActions';

const initialState = {
  getMachinePools: {
    ...baseRequestState,
    data: [],
  },
  addMachinePoolResponse: {
    ...baseRequestState,
  },
  scaleMachinePoolResponse: {
    ...baseRequestState,
  },
  deleteMachinePoolResponse: {
    ...baseRequestState,
  },
};

function MachinePoolsReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      // GET_MACHINE_POOLS
      case PENDING_ACTION(GET_MACHINE_POOLS):
        draft.getMachinePools.pending = true;
        break;

      case FULFILLED_ACTION(GET_MACHINE_POOLS):
        draft.getMachinePools = {
          ...initialState.getMachinePools,
          fulfilled: true,
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

      // ADD_MACHINE_POOL
      case PENDING_ACTION(ADD_MACHINE_POOL):
        draft.addMachinePoolResponse.pending = true;
        break;

      case FULFILLED_ACTION(ADD_MACHINE_POOL):
        draft.addMachinePoolResponse = {
          ...initialState.addMachinePoolResponse,
          fulfilled: true,
        };
        break;

      case REJECTED_ACTION(ADD_MACHINE_POOL):
        draft.addMachinePoolResponse = {
          ...initialState.addMachinePoolResponse,
          ...getErrorState(action),
        };
        break;

      // CLEAR_ADD_MACHINE_POOL_RESPONSE
      case CLEAR_ADD_MACHINE_POOL_RESPONSE:
        draft.addMachinePoolResponse = { ...initialState.addMachinePoolResponse };
        break;

      // SCALE_MACHINE_POOL
      case PENDING_ACTION(SCALE_MACHINE_POOL):
      case PENDING_ACTION(PATCH_NODE_POOL):
        draft.scaleMachinePoolResponse.pending = true;
        break;

      case FULFILLED_ACTION(SCALE_MACHINE_POOL):
      case FULFILLED_ACTION(PATCH_NODE_POOL):
        draft.scaleMachinePoolResponse = {
          ...initialState.scaleMachinePoolResponse,
          fulfilled: true,
        };
        break;

      case REJECTED_ACTION(SCALE_MACHINE_POOL):
      case REJECTED_ACTION(PATCH_NODE_POOL):
        draft.scaleMachinePoolResponse = {
          ...initialState.scaleMachinePoolResponse,
          ...getErrorState(action),
        };
        break;

      // CLEAR_SCALE_MACHINE_POOL_RESPONSE
      case CLEAR_SCALE_MACHINE_POOL_RESPONSE:
        draft.scaleMachinePoolResponse = { ...initialState.scaleMachinePoolResponse };
        break;

      // DELETE_MACHINE_POOL
      case PENDING_ACTION(DELETE_MACHINE_POOL):
        draft.deleteMachinePoolResponse.pending = true;
        break;

      case FULFILLED_ACTION(DELETE_MACHINE_POOL):
        draft.deleteMachinePoolResponse = {
          ...initialState.deleteMachinePoolResponse,
          fulfilled: true,
        };
        break;

      case REJECTED_ACTION(DELETE_MACHINE_POOL):
        draft.deleteMachinePoolResponse = {
          ...initialState.deleteMachinePoolResponse,
          ...getErrorState(action),
        };
        break;

      // CLEAR_DELETE_MACHINE_POOL_RESPONSE
      case CLEAR_DELETE_MACHINE_POOL_RESPONSE:
        draft.deleteMachinePoolResponse = { ...initialState.deleteMachinePoolResponse };
        break;
    }
  });
}

MachinePoolsReducer.initialState = initialState;

export { initialState, MachinePoolsReducer };

export default MachinePoolsReducer;
