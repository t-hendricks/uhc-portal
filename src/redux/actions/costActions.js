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

import { costConstants } from '../constants';
import { costService } from '../../services';

const getReport = (params) => (dispatch) =>
  dispatch({
    type: costConstants.GET_REPORT,
    payload: costService.getReport(params),
  });

const getSources = (params) => (dispatch) =>
  dispatch({
    type: costConstants.GET_SOURCES,
    payload: costService.getSources(params),
  });

const getUserAccess = (params) => (dispatch) =>
  dispatch({
    type: costConstants.GET_USER_ACCESS,
    payload: costService.getUserAccess(params),
  });

const costActions = {
  getReport,
  getSources,
  getUserAccess,
};

export { costActions, getReport, getSources, getUserAccess };
