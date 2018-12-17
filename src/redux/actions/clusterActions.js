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
import { clusterConstants } from '../constants';
import { clusterService } from '../../services';
import helpers from '../../common/helpers';

const invalidateClusters = () => dispatch => dispatch({
  type: helpers.INVALIDATE_ACTION(clusterConstants.GET_CLUSTERS),
});

const createCluster = params => dispatch => dispatch({
  type: clusterConstants.CREATE_CLUSTER,
  payload: clusterService.postNewCluster(params).then((response) => {
    // TODO: this artificially delays CREATE_CLUSTER_FULLFILLED action
    // until after the INVALIDATE action.
    invalidateClusters()(dispatch);
    return response;
  }),
});

const clearClusterResponse = () => dispatch => dispatch({
  type: clusterConstants.CLEAR_DISPLAY_NAME_RESPONSE,
});

const editCluster = (id, cluster) => dispatch => dispatch({
  type: clusterConstants.EDIT_CLUSTER_DISPLAY_NAME,
  payload: clusterService.editCluster(id, cluster),
});


const fetchClusters = params => dispatch => dispatch({
  type: clusterConstants.GET_CLUSTERS,
  payload: clusterService.getClusters(params),
});

const fetchClusterDetails = clusterID => dispatch => dispatch({
  type: clusterConstants.GET_CLUSTER_DETAILS,
  payload: clusterService.getClusterDetails(clusterID),
});

const resetCreatedClusterResponse = () => dispatch => dispatch({
  type: clusterConstants.RESET_CREATED_CLUSTER_RESPONSE,
});

const clusterActions = {
  clearClusterResponse,
  createCluster,
  editCluster,
  fetchClusters,
  fetchClusterDetails,
  invalidateClusters,
  resetCreatedClusterResponse,
};

export {
  clusterActions, createCluster, editCluster, fetchClusters, fetchClusterDetails,
  invalidateClusters, clearClusterResponse, resetCreatedClusterResponse,
};
