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
import helpers, { setStateProp } from '../reduxHelpers';
import { getErrorState } from '../../common/errors';

import { clustersConstants } from '../constants';

const baseState = {
  error: false,
  errorMessage: '',
  errorDetails: null,
  pending: false,
  fulfilled: false,
  valid: true,
};

const initialState = {
  clusters: {
    ...baseState,
    valid: false,
    clusters: [],
  },
  details: {
    ...baseState,
    cluster: null,
  },
  createdCluster: {
    ...baseState,
    cluster: null,
  },
  editedCluster: {
    ...baseState,
    cluster: null,
  },
  archivedCluster: {
    ...baseState,
    cluster: null,
  },
  unarchivedCluster: {
    ...baseState,
    cluster: null,
  },
};

function clustersReducer(state = initialState, action) {
  switch (action.type) {
    // GET_CLUSTERS
    case helpers.INVALIDATE_ACTION(clustersConstants.GET_CLUSTERS):
      return setStateProp(
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
      return setStateProp(
        'clusters',
        {
          ...getErrorState(action),
          valid: true,
          clusters: state.clusters.clusters,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(clustersConstants.GET_CLUSTERS):
      return setStateProp(
        'clusters',
        {
          pending: true,
          valid: true,
          clusters: state.clusters.clusters,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(clustersConstants.GET_CLUSTERS):
      return setStateProp(
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

    // GET_CLUSTER_DETAILS
    case helpers.REJECTED_ACTION(clustersConstants.GET_CLUSTER_DETAILS):
      return setStateProp(
        'details',
        {
          ...getErrorState(action),
          cluster: state.details.cluster, // preserve previous cluster even on error
        },
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(clustersConstants.GET_CLUSTER_DETAILS):
      return setStateProp(
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
      return setStateProp(
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

    // CREATE_CLUSTER
    case helpers.REJECTED_ACTION(clustersConstants.CREATE_CLUSTER):
      return setStateProp(
        'createdCluster',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(clustersConstants.CREATE_CLUSTER):
      return setStateProp(
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
      return setStateProp(
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

    // EDIT_CLUSTER
    case helpers.REJECTED_ACTION(clustersConstants.EDIT_CLUSTER):
      return setStateProp(
        'editedCluster',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(clustersConstants.EDIT_CLUSTER):
      return setStateProp(
        'editedCluster',
        {
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(clustersConstants.EDIT_CLUSTER):
      return setStateProp(
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
      return setStateProp(
        'editedCluster',
        initialState.editedCluster,
        {
          state,
          initialState,
        },
      );


    // Archive cluster
    case helpers.FULFILLED_ACTION(clustersConstants.ARCHIVE_CLUSTER):
      return setStateProp(
        'archivedCluster',
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

    case helpers.REJECTED_ACTION(clustersConstants.ARCHIVE_CLUSTER):
      return setStateProp(
        'archivedCluster',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(clustersConstants.ARCHIVE_CLUSTER):
      return setStateProp(
        'archivedCluster',
        {
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case clustersConstants.CLEAR_CLUSTER_ARCHIVE_RESPONSE:
      return setStateProp(
        'archivedCluster',
        {
          ...initialState.archivedCluster,
        },
        {
          state,
          initialState,
        },
      );

    // UnArchive cluster
    case helpers.FULFILLED_ACTION(clustersConstants.UNARCHIVE_CLUSTER):
      return setStateProp(
        'unarchivedCluster',
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

    case helpers.REJECTED_ACTION(clustersConstants.UNARCHIVE_CLUSTER):
      return setStateProp(
        'unarchivedCluster',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(clustersConstants.UNARCHIVE_CLUSTER):
      return setStateProp(
        'unarchivedCluster',
        {
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case clustersConstants.CLEAR_CLUSTER_UNARCHIVE_RESPONSE:
      return setStateProp(
        'unarchivedCluster',
        {
          ...initialState.unarchivedCluster,
        },
        {
          state,
          initialState,
        },
      );

    case clustersConstants.RESET_CREATED_CLUSTER_RESPONSE:
      return setStateProp(
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
