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
import helpers, { setStateProp } from '../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../common/errors';
import { deleteClusterDialogConstants } from './DeleteClusterDialogConstants';

const initialState = {
  deletedCluster: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    cluster: null,
  },
};

function deleteClusterDialogReducer(state = initialState, action) {
  switch (action.type) {
    case helpers.REJECTED_ACTION(deleteClusterDialogConstants.DELETE_CLUSTER):
      return setStateProp(
        'deletedCluster',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(deleteClusterDialogConstants.DELETE_CLUSTER):
      return setStateProp(
        'deletedCluster',
        {
          pending: true,
          cluster: null,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(deleteClusterDialogConstants.DELETE_CLUSTER):
      return setStateProp(
        'deletedCluster',
        {
          cluster: action.payload.data,
          pending: false,
          fulfilled: true,
        },
        {
          state,
          initialState,
        },
      );

    case deleteClusterDialogConstants.CLEAR_DELETE_CLUSTER_RESPONSE:
      return setStateProp(
        'deletedCluster',
        initialState.deletedCluster,
        {
          state,
          initialState,
        },
      );
    default:
      return state;
  }
}

deleteClusterDialogReducer.initialState = initialState;

export { initialState, deleteClusterDialogReducer };

export default deleteClusterDialogReducer;
