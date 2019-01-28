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
import { clustersConstants } from '../constants';
import { clusterService } from '../../services';
import helpers from '../../common/helpers';

const invalidateClusters = () => dispatch => dispatch({
  type: helpers.INVALIDATE_ACTION(clustersConstants.GET_CLUSTERS),
});

const createCluster = params => dispatch => dispatch({
  type: clustersConstants.CREATE_CLUSTER,
  payload: clusterService.postNewCluster(params).then((response) => {
    // TODO: this artificially delays CREATE_CLUSTER_FULLFILLED action
    // until after the INVALIDATE action.
    invalidateClusters()(dispatch);
    return response;
  }),
});

const clearClusterResponse = () => dispatch => dispatch({
  type: clustersConstants.CLEAR_DISPLAY_NAME_RESPONSE,
});

const editCluster = (id, cluster) => dispatch => dispatch({
  type: clustersConstants.EDIT_CLUSTER_DISPLAY_NAME,
  payload: clusterService.editCluster(id, cluster),
});


const fetchClusters = params => dispatch => dispatch({
  type: clustersConstants.GET_CLUSTERS,
  payload: clusterService.getClusters(params),
});

const fetchClusterDetails = clusterID => dispatch => dispatch({
  type: clustersConstants.GET_CLUSTER_DETAILS,
  payload: clusterService.getClusterDetails(clusterID),
});

const fetchClusterCredentials = clusterID => dispatch => dispatch({
  type: clustersConstants.GET_CLUSTER_CREDENTIALS,
  payload: clusterService.getClusterCredentials(clusterID),
});


const resetCreatedClusterResponse = () => dispatch => dispatch({
  type: clustersConstants.RESET_CREATED_CLUSTER_RESPONSE,
});

const clustersActions = {
  clearClusterResponse,
  createCluster,
  editCluster,
  fetchClusters,
  fetchClusterDetails,
  fetchClusterCredentials,
  invalidateClusters,
  resetCreatedClusterResponse,
};

export {
  clustersActions, createCluster, editCluster, fetchClusters, fetchClusterDetails,
  invalidateClusters, clearClusterResponse, resetCreatedClusterResponse, fetchClusterCredentials,
};
