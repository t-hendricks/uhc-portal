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

const baseState = {
  error: false,
  errorMessage: '',
  errorDetails: null,
  pending: false,
  fulfilled: false,
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
    showToast: false,
  },
  unarchivedCluster: {
    ...baseState,
    cluster: null,
    showToast: false,
  },
};

function clustersReducer(state = initialState, action) {
  switch (action.type) {
    // GET_CLUSTERS
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
          ...helpers.getErrorState(action),
          valid: true,
          clusters: state.clusters.clusters,
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

    // GET_CLUSTER_DETAILS
    case helpers.REJECTED_ACTION(clustersConstants.GET_CLUSTER_DETAILS):
      return helpers.setStateProp(
        'details',
        {
          ...helpers.getErrorState(action),
          cluster: state.details.cluster, // preserve previous cluster even on error
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

    // CREATE_CLUSTER
    case helpers.REJECTED_ACTION(clustersConstants.CREATE_CLUSTER):
      return helpers.setStateProp(
        'createdCluster',
        helpers.getErrorState(action),
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

    // EDIT_CLUSTER
    case helpers.REJECTED_ACTION(clustersConstants.EDIT_CLUSTER):
      return helpers.setStateProp(
        'editedCluster',
        helpers.getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(clustersConstants.EDIT_CLUSTER):
      return helpers.setStateProp(
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


    // Archive cluster
    case helpers.FULFILLED_ACTION(clustersConstants.ARCHIVE_CLUSTER):
      return helpers.setStateProp(
        'archivedCluster',
        {
          cluster: action.payload.data,
          pending: false,
          fulfilled: true,
          showToast: true,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.REJECTED_ACTION(clustersConstants.ARCHIVE_CLUSTER):
      return helpers.setStateProp(
        'archivedCluster',
        helpers.getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(clustersConstants.ARCHIVE_CLUSTER):
      return helpers.setStateProp(
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
      return helpers.setStateProp(
        'archivedCluster',
        {
          ...initialState.archivedCluster,
          showToast: state.archivedCluster.fulfilled,
        },
        {
          state,
          initialState,
        },
      );

    case clustersConstants.ARCHIVE_CLUSTER_RESET_SHOW_TOAST:
      return helpers.setStateProp(
        'archivedCluster',
        {
          showToast: false,
        },
        {
          state,
          initialState,
        },
      );

    // UnArchive cluster
    case helpers.FULFILLED_ACTION(clustersConstants.UNARCHIVE_CLUSTER):
      return helpers.setStateProp(
        'unarchivedCluster',
        {
          cluster: action.payload.data,
          pending: false,
          fulfilled: true,
          showToast: true,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.REJECTED_ACTION(clustersConstants.UNARCHIVE_CLUSTER):
      return helpers.setStateProp(
        'unarchivedCluster',
        helpers.getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(clustersConstants.UNARCHIVE_CLUSTER):
      return helpers.setStateProp(
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
      return helpers.setStateProp(
        'unarchivedCluster',
        {
          ...initialState.unarchivedCluster,
          showToast: state.unarchivedCluster.fulfilled,
        },
        {
          state,
          initialState,
        },
      );

    case clustersConstants.UNARCHIVE_CLUSTER_RESET_SHOW_TOAST:
      return helpers.setStateProp(
        'unarchivedCluster',
        {
          showToast: false,
        },
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
