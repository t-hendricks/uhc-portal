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

import get from 'lodash/get';
import { GET_CLUSTER_INSIGHTS, GET_ORGANIZATION_INSIGHTS } from './InsightsConstants';
import { insightsService } from '../../../../../services';

const fetchSingleClusterInsights = (clusterId) =>
  insightsService.getClusterInsights(clusterId).then((response) => ({
    insightsData: get(response, 'data.report', {}),
    clusterId,
    status: response.status,
  }));

export const fetchClusterInsights = (clusterId) => (dispatch) =>
  dispatch({
    type: GET_CLUSTER_INSIGHTS,
    payload: fetchSingleClusterInsights(clusterId),
    meta: {
      clusterId,
    },
  });

export const fetchOrganizationInsights = () => (dispatch) =>
  dispatch({
    type: GET_ORGANIZATION_INSIGHTS,
    payload: insightsService.getOrganizationInsights(),
  });
