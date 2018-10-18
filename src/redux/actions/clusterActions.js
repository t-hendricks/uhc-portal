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

const createCluster = params => dispatch => dispatch({
  type: clusterConstants.CREATE_CLUSTER,
  payload: clusterService.postNewCluster(params),
});

const invalidateClusters = () => ({
  type: helpers.INVALIDATE_ACTION(clusterConstants.GET_CLUSTERS),
});

const fetchClusters = params => dispatch => dispatch({
  type: clusterConstants.GET_CLUSTERS,
  payload: clusterService.getClusters(params),
});

const fetchClusterDetails = clusterID => dispatch => dispatch({
  type: clusterConstants.GET_CLUSTER_DETAILS,
  payload: clusterService.getClusterDetails(clusterID),
});

const clusterActions = {
  createCluster,
  fetchClusters,
  fetchClusterDetails,
};

export {
  clusterActions, createCluster, fetchClusters, fetchClusterDetails,
};
