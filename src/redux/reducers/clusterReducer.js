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
import { clusterConstants } from '../constants';

const initialState = {
  clusters: {
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
  createdCluster: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    cluster: null,
  },
};

function clusterReducer(state = initialState, action) {
  switch (action.type) {
    case helpers.REJECTED_ACTION(clusterConstants.GET_CLUSTERS):
      return helpers.setStateProp(
        'clusters',
        {
          pending: false,
          error: action.error,
          errorMessage: helpers.getErrorMessageFromResults(action.payload),
        },
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(clusterConstants.GET_CLUSTERS):
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

    case helpers.FULFILLED_ACTION(clusterConstants.GET_CLUSTERS):
      return helpers.setStateProp(
        'clusters',
        {
          clusters: action.payload.data.items,
          pending: false,
          fulfilled: true,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.REJECTED_ACTION(clusterConstants.GET_CLUSTER_DETAILS):
      return helpers.setStateProp(
        'details',
        {
          pending: false,
          error: action.error,
          errorMessage: helpers.getErrorMessageFromResults(action.payload),
        },
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(clusterConstants.GET_CLUSTER_DETAILS):
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

    case helpers.FULFILLED_ACTION(clusterConstants.GET_CLUSTER_DETAILS):
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

    case helpers.REJECTED_ACTION(clusterConstants.CREATE_CLUSTER):
      return helpers.setStateProp(
        'createdCluster',
        {
          pending: false,
          error: action.error,
          errorMessage: helpers.getErrorMessageFromResults(action.payload),
        },
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(clusterConstants.CREATE_CLUSTER):
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

    case helpers.FULFILLED_ACTION(clusterConstants.CREATE_CLUSTER):
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


    default:
      return state;
  }
}

clusterReducer.initialState = initialState;

export { initialState, clusterReducer };

export default clusterReducer;
