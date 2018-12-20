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
import helpers from '../../common/helpers';
import { clusterConstants } from './ClusterConstants';

const initialState = {
  deletedCluster: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    cluster: null,
  },
};

function clusterReducer(state = initialState, action) {
  switch (action.type) {
    case helpers.REJECTED_ACTION(clusterConstants.DELETE_CLUSTER):
      return helpers.setStateProp(
        'deletedCluster',
        {
          pending: false,
          error: action.error,
          errorMessage: helpers.getErrorMessage(action.payload),
        },
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(clusterConstants.DELETE_CLUSTER):
      return helpers.setStateProp(
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

    case helpers.FULFILLED_ACTION(clusterConstants.DELETE_CLUSTER):
      return helpers.setStateProp(
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

    case clusterConstants.CLEAR_DELETE_CLUSTER_RESPONSE:
      return helpers.setStateProp(
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

clusterReducer.initialState = initialState;

export { initialState, clusterReducer };

export default clusterReducer;
