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
import merge from 'lodash/merge';
import { produce } from 'immer';
import {
  REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION, INVALIDATE_ACTION,
  baseRequestState,
} from '../reduxHelpers';
import { getErrorState } from '../../common/errors';

import { clustersConstants } from '../constants';

const baseState = {
  ...baseRequestState,
  valid: true,
};

const initialState = {
  clusters: {
    ...baseState,
    valid: false,
    clusters: [],
    queryParams: {},
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
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    switch (action.type) {
      // GET_CLUSTERS
      case INVALIDATE_ACTION(clustersConstants.GET_CLUSTERS):
        draft.clusters = { ...initialState.clusters };
        break;
      case REJECTED_ACTION(clustersConstants.GET_CLUSTERS):
        draft.clusters = {
          ...initialState.clusters,
          ...getErrorState(action),
          valid: true,
          clusters: state.clusters.clusters,
        };
        break;
      case PENDING_ACTION(clustersConstants.GET_CLUSTERS):
        draft.clusters = {
          ...initialState.clusters,
          pending: true,
          valid: true,
          clusters: state.clusters.clusters,
        };
        break;
      case FULFILLED_ACTION(clustersConstants.GET_CLUSTERS):
        draft.clusters = {
          ...initialState.clusters,
          clusters: action.payload.data.items,
          queryParams: action.payload.data.queryParams,
          pending: false,
          fulfilled: true,
          valid: true,
        };
        break;
      case clustersConstants.SET_CLUSTER_DETAILS: {
        const { cluster, mergeDetails } = action.payload;
        draft.details = {
          ...initialState.details,
          cluster: mergeDetails ? merge({}, state.details.cluster, cluster) : cluster,
          fulfilled: true,
          incomplete: true,
        };
        break;
      }
      // GET_CLUSTER_DETAILS
      case REJECTED_ACTION(clustersConstants.GET_CLUSTER_DETAILS):
        draft.details = {
          ...initialState.details,
          ...getErrorState(action),
          cluster: state.details.cluster, // preserve previous cluster even on error
        };
        break;
      case PENDING_ACTION(clustersConstants.GET_CLUSTER_DETAILS):
        draft.details = {
          ...initialState.details,
          pending: true,
          cluster: state.details.cluster,
        };
        break;
      case FULFILLED_ACTION(clustersConstants.GET_CLUSTER_DETAILS):
        draft.details = {
          ...initialState.details,
          fulfilled: true,
          incomplete: false,
          cluster: action.payload.data,
        };
        break;

      // CREATE_CLUSTER
      case REJECTED_ACTION(clustersConstants.CREATE_CLUSTER):
        draft.createdCluster = {
          ...initialState.createdCluster,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(clustersConstants.CREATE_CLUSTER):
        draft.createdCluster = {
          ...initialState.createdCluster,
          pending: true,
        };
        break;
      case FULFILLED_ACTION(clustersConstants.CREATE_CLUSTER):
        draft.createdCluster = {
          ...initialState.createdCluster,
          cluster: action.payload.data,
          fulfilled: true,
        };
        break;
      case clustersConstants.RESET_CREATED_CLUSTER_RESPONSE:
        draft.createdCluster = {
          ...initialState.createdCluster,
        };
        break;

      // EDIT_CLUSTER
      case REJECTED_ACTION(clustersConstants.EDIT_CLUSTER):
        draft.editedCluster = {
          ...initialState.editedCluster,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(clustersConstants.EDIT_CLUSTER):
        draft.editedCluster = {
          ...initialState.editedCluster,
          pending: true,
        };
        break;
      case FULFILLED_ACTION(clustersConstants.EDIT_CLUSTER):
        draft.editedCluster = {
          ...initialState.editedCluster,
          cluster: action.payload.data,
          fulfilled: true,
        };
        break;
      case clustersConstants.CLEAR_DISPLAY_NAME_RESPONSE:
        draft.editedCluster = {
          ...initialState.editedCluster,
        };
        break;

      // Archive cluster
      case FULFILLED_ACTION(clustersConstants.ARCHIVE_CLUSTER):
        draft.archivedCluster = {
          ...initialState.editedCluster,
          cluster: action.payload.data,
          fulfilled: true,
        };
        break;
      case REJECTED_ACTION(clustersConstants.ARCHIVE_CLUSTER):
        draft.archivedCluster = {
          ...initialState.archivedCluster,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(clustersConstants.ARCHIVE_CLUSTER):
        draft.archivedCluster = {
          ...initialState.archivedCluster,
          pending: true,
        };
        break;
      case clustersConstants.CLEAR_CLUSTER_ARCHIVE_RESPONSE:
        draft.archivedCluster = {
          ...initialState.archivedCluster,
        };
        break;

      // UnArchive cluster
      case FULFILLED_ACTION(clustersConstants.UNARCHIVE_CLUSTER):
        draft.unarchivedCluster = {
          ...initialState.unarchivedCluster,
          cluster: action.payload.data,
          fulfilled: true,
        };
        break;
      case REJECTED_ACTION(clustersConstants.UNARCHIVE_CLUSTER):
        draft.unarchivedCluster = {
          ...initialState.unarchivedCluster,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(clustersConstants.UNARCHIVE_CLUSTER):
        draft.unarchivedCluster = {
          ...initialState.unarchivedCluster,
          pending: true,
        };
        break;
      case clustersConstants.CLEAR_CLUSTER_UNARCHIVE_RESPONSE:
        draft.unarchivedCluster = {
          ...initialState.unarchivedCluster,
        };
        break;

      default:
        return state;
    }
  });
}

clustersReducer.initialState = initialState;

export { initialState, clustersReducer };

export default clustersReducer;
