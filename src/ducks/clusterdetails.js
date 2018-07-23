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

import { combineReducers } from 'redux';
import * as fromClusters from '../apis/clusters';


export const getClusterDetails = state => state.clusterDetails.clusterDetails;
export const showSelector = state => state.clusterDetails.clusterDetailsShowReducer.visible;
export const currentCluster = state => state.clusterDetails.clusterDetailsShowReducer.currentCluster;



// ACTIONS
const CLUSTER_DETAILS_RESPONSE = 'CLUSTER_DETAILS_RESPONSE';
const CLUSTER_DETAILS_SHOW = 'CLUSTER_DETAILS_SHOW';


export const clusterDetailsResponse = (payload) => {
  return {
    payload,
    type: CLUSTER_DETAILS_RESPONSE,
  };
};

const clusterDetailsShow = (payload) => {
  return {
    payload,
    type: CLUSTER_DETAILS_SHOW,
  };
};

// ACTIONS
export const fetchClusterDetails = clusterID => (dispatch, getState) => {
  const state = getState();
  fromClusters.fetchClusterDetails({clusterID: clusterID}).then((response) => {
      response.json().then((value) => {
      var ret = {}
      ret[clusterID] = value;
      dispatch(clusterDetailsResponse(ret))});
    })
};

export const showClusterDetails = clusterID => (dispatch, getState) => {
    dispatch(clusterDetailsShow({visible: true, currentCluster: clusterID}));
};

export const hideClusterDetails = () => (dispatch, getState) => {
  dispatch(clusterDetailsShow({visible: false}));
};



// REDUCERS

const clusterDetails = (state = {}, action) => {
  switch (action.type) {
    case CLUSTER_DETAILS_RESPONSE:
      return action.payload;
    default:
      return state;
  }
};

const clusterDetailsShowReducer = (state = {visible: false, currentCluster: null}, action) => {
  switch (action.type) {
    case CLUSTER_DETAILS_SHOW:
      return action.payload;
    default:
      return state;
  }
};


export default combineReducers({clusterDetails, clusterDetailsShowReducer})
