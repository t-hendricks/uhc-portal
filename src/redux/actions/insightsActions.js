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
import { insightsConstants } from '../constants';
import { insightsService } from '../../services';

const fetchSingleClusterInsights = async (clusterID) => {
  const clusterResponse = await insightsService.getClusterInsights(clusterID);
  if (!clusterResponse || !clusterResponse.data) {
    // create a fake 404 error so 404 handling in components will work as if it was a regular 404.
    const error = Error('Insights for cluster not found');
    error.response = { status: 404 };
    return Promise.reject(error);
  }
  return { insights: clusterResponse.data, clusterID };
};

export const fetchClusterInsights = clusterID => dispatch => dispatch({
  type: insightsConstants.GET_CLUSTER_INSIGHTS,
  payload: fetchSingleClusterInsights(clusterID),
});

export const setClusterInsights = (insights, clusterID) => dispatch => dispatch({
  type: insightsConstants.SET_CLUSTER_INSIGHTS,
  payload: {
    insights,
    clusterID,
  },
});
