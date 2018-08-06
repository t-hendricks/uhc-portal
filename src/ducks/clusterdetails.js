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
import * as fromClusterDetails from '../apis/clusterDetails';


export const getClusterDetails = state => state.clusterDetails.clusterDetails;


// ACTIONS
const CLUSTER_DETAILS_RESPONSE = 'CLUSTER_DETAILS_RESPONSE';

export const clusterDetailsResponse = payload => ({
  payload,
  type: CLUSTER_DETAILS_RESPONSE,
});

// ACTIONS
export const fetchClusterDetails = clusterID => (dispatch, getState) => {
  const state = getState();
  fromClusterDetails.fetchClusterDetails({ clusterID }).then((response) => {
    response.json().then((value) => {
      const ret = {};
      ret[clusterID] = value;
      dispatch(clusterDetailsResponse(ret));
    });
  });
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


export default combineReducers({ clusterDetails });
