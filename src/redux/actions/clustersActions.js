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
import { clusterService, authorizationsService } from '../../services';
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

const fetchClustersAndPermissions = (clusterRequestParams) => {
  let result;
  let canEdit;
  let canDelete;
  const buildPermissionDict = (response) => {
    const ret = {};
    if (!response || !response.data || !response.data.cluster_ids) {
      return ret;
    }
    response.data.cluster_ids.forEach((clusterID) => {
      ret[clusterID] = true;
    });
    return ret;
  };
  const promises = [
    clusterService.getClusters(clusterRequestParams).then((response) => {
      result = response;
    }),
    authorizationsService.selfResourceReview(
      { action: 'delete', resource_type: 'Cluster' },
    ).then((response) => { canDelete = buildPermissionDict(response); }),
    authorizationsService.selfResourceReview(
      { action: 'update', resource_type: 'Cluster' },
    ).then((response) => { canEdit = buildPermissionDict(response); }),
  ];
  return Promise.all(promises).then(() => {
    for (let i = 0; i < result.data.items.length; i += 1) {
      const cluster = result.data.items[i];
      result.data.items[i].canEdit = canEdit['*'] || !!canEdit[cluster.id];
      result.data.items[i].canDelete = canDelete['*'] || !!canDelete[cluster.id];
    }
    return result;
  });
};


const fetchClusters = params => dispatch => dispatch({
  type: clustersConstants.GET_CLUSTERS,
  payload: fetchClustersAndPermissions(params),
});

const fetchSingleClusterAndPermissions = (clusterID) => {
  let result;
  let canEdit;
  let canDelete;
  const promises = [
    clusterService.getClusterDetails(clusterID).then((response) => { result = response; }),
    authorizationsService.selfAccessReview(
      { action: 'delete', resource_type: 'Cluster', cluster_id: clusterID },
    ).then((response) => { canDelete = response.data.allowed; }),
    authorizationsService.selfAccessReview(
      { action: 'update', resource_type: 'Cluster', cluster_id: clusterID },
    ).then((response) => { canEdit = response.data.allowed; }),
  ];
  return Promise.all(promises).then(() => {
    result.data.canEdit = canEdit;
    result.data.canDelete = canDelete;
    return result;
  });
};

const fetchClusterDetails = clusterID => dispatch => dispatch({
  type: clustersConstants.GET_CLUSTER_DETAILS,
  payload: fetchSingleClusterAndPermissions(clusterID),
});

const fetchClusterCredentials = clusterID => dispatch => dispatch({
  type: clustersConstants.GET_CLUSTER_CREDENTIALS,
  payload: clusterService.getClusterCredentials(clusterID),
});

const fetchClusterRouterShards = clusterID => dispatch => dispatch({
  type: clustersConstants.GET_CLUSTER_ROUTER_SHARDS,
  payload: clusterService.getClusterRouterShards(clusterID),
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
  fetchClusterRouterShards,
  invalidateClusters,
  resetCreatedClusterResponse,
};

export {
  clustersActions,
  clearClusterResponse,
  createCluster,
  editCluster,
  fetchClusters,
  fetchClusterDetails,
  fetchClusterCredentials,
  fetchClusterRouterShards,
  invalidateClusters,
  resetCreatedClusterResponse,
};
