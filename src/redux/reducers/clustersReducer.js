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
import { clustersConstants } from '../constants';

const initialState = {
  clusters: {
    valid: false,
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    clusters: [],
  },
  details: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    cluster: null,
  },
  credentials: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    credentials: null,
  },
  createdCluster: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    cluster: null,
  },
  editedCluster: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    cluster: null,
  },
};

function clustersReducer(state = initialState, action) {
  switch (action.type) {
    case helpers.INVALIDATE_ACTION(clustersConstants.GET_CLUSTERS):
      return helpers.setStateProp(
        'clusters',
        {
          valid: false,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.REJECTED_ACTION(clustersConstants.GET_CLUSTERS):
      return helpers.setStateProp(
        'clusters',
        {
          pending: false,
          valid: true,
          error: action.error,
          errorMessage: helpers.getErrorMessage(action.payload),
        },
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(clustersConstants.GET_CLUSTERS):
      return helpers.setStateProp(
        'clusters',
        {
          pending: true,
          clusters: state.clusters.clusters,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(clustersConstants.GET_CLUSTERS):
      return helpers.setStateProp(
        'clusters',
        {
          clusters: action.payload.data.items,
          pending: false,
          fulfilled: true,
          valid: true,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.REJECTED_ACTION(clustersConstants.GET_CLUSTER_DETAILS):
      return helpers.setStateProp(
        'details',
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

    case helpers.PENDING_ACTION(clustersConstants.GET_CLUSTER_DETAILS):
      return helpers.setStateProp(
        'details',
        {
          pending: true,
          cluster: state.details.cluster,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(clustersConstants.GET_CLUSTER_DETAILS):
      return helpers.setStateProp(
        'details',
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

    case helpers.REJECTED_ACTION(clustersConstants.GET_CLUSTER_CREDENTIALS):
      return helpers.setStateProp(
        'credentials',
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

    case helpers.PENDING_ACTION(clustersConstants.GET_CLUSTER_CREDENTIALS):
      return helpers.setStateProp(
        'credentials',
        {
          pending: true,
          credentials: state.credentials.credentials,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(clustersConstants.GET_CLUSTER_CREDENTIALS):
      return helpers.setStateProp(
        'credentials',
        {
          credentials: action.payload.data,
          pending: false,
          fulfilled: true,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.REJECTED_ACTION(clustersConstants.CREATE_CLUSTER):
      return helpers.setStateProp(
        'createdCluster',
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

    case helpers.PENDING_ACTION(clustersConstants.CREATE_CLUSTER):
      return helpers.setStateProp(
        'createdCluster',
        {
          pending: true,
          cluster: null,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(clustersConstants.CREATE_CLUSTER):
      return helpers.setStateProp(
        'createdCluster',
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

    case helpers.REJECTED_ACTION(clustersConstants.EDIT_CLUSTER_DISPLAY_NAME):
      return helpers.setStateProp(
        'editedCluster',
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

    case helpers.PENDING_ACTION(clustersConstants.EDIT_CLUSTER_DISPLAY_NAME):
      return helpers.setStateProp(
        'editedCluster',
        {
          pending: true,
          cluster: null,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(clustersConstants.EDIT_CLUSTER_DISPLAY_NAME):
      return helpers.setStateProp(
        'editedCluster',
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

    case clustersConstants.CLEAR_DISPLAY_NAME_RESPONSE:
      return helpers.setStateProp(
        'editedCluster',
        initialState.editedCluster,
        {
          state,
          initialState,
        },
      );

    case clustersConstants.RESET_CREATED_CLUSTER_RESPONSE:
      return helpers.setStateProp(
        'createdCluster',
        initialState.createdCluster,
        {
          state,
          initialState,
        },
      );

    default:
      return state;
  }
}

clustersReducer.initialState = initialState;

export { initialState, clustersReducer };

export default clustersReducer;
