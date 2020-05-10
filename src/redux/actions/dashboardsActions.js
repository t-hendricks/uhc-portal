/*
Copyright (c) 2020 Red Hat, Inc.

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

import { dashboardsConstants } from '../constants';
import { clusterService } from '../../services';


const getDashboard = id => clusterService.getDashboard(id).then(
  (dashboardResponse) => {
    const dashboard = {};
    const metrics = {};
    dashboardResponse.data.metrics.forEach((metric) => {
      metrics[metric.name] = metric.vector;
    });
    dashboard[dashboardResponse.data.name] = metrics;
    return dashboard;
  },
);

const getSummaryDashboard = () => dispatch => dispatch({
  type: dashboardsConstants.GET_SUMMARY_DASHBOARD,
  payload: getDashboard(dashboardsConstants.SUMMARY_DASHBOARD),
});


const getUnhealthyClusters = params => dispatch => dispatch({
  type: dashboardsConstants.GET_UNHEALTHY_CLUSTERS,
  payload: clusterService.getUnhealthyClusters(params),
});

export {
  getSummaryDashboard,
  getUnhealthyClusters,
};

const dashboardsActions = {
  getSummaryDashboard,
  getUnhealthyClusters,
};

export default dashboardsActions;
