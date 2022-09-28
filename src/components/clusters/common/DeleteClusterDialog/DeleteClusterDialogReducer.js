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
} from '../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../common/errors';
import { deleteClusterDialogConstants } from './DeleteClusterDialogConstants';

const initialState = {
  ...baseRequestState,
  cluster: null,
};

function deleteClusterDialogReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case REJECTED_ACTION(deleteClusterDialogConstants.DELETE_CLUSTER):
        return {
          ...initialState,
          ...getErrorState(action),
        };
      case PENDING_ACTION(deleteClusterDialogConstants.DELETE_CLUSTER):
        draft.pending = true;
        break;
      case FULFILLED_ACTION(deleteClusterDialogConstants.DELETE_CLUSTER):
        return {
          ...initialState,
          cluster: action.payload.data,
          fulfilled: true,
        };
      case deleteClusterDialogConstants.CLEAR_DELETE_CLUSTER_RESPONSE:
        return initialState;
    }
  });
}

deleteClusterDialogReducer.initialState = initialState;

export { initialState, deleteClusterDialogReducer };

export default deleteClusterDialogReducer;
