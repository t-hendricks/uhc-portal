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

import { action, ActionType } from 'typesafe-actions';
import { costConstants } from '../constants';
import { costService } from '../../services';
import type { AppThunk } from '../types';

const getReportAction = (params: Parameters<typeof costService.getReport>[0]) =>
  action(costConstants.GET_REPORT, costService.getReport(params));

const getReport =
  (params: Parameters<typeof getReportAction>[0]): AppThunk =>
  (dispatch) =>
    dispatch(getReportAction(params));

const getSourcesAction = (params: Parameters<typeof costService.getSources>[0]) =>
  action(costConstants.GET_SOURCES, costService.getSources(params));

const getSources =
  (params: Parameters<typeof costService.getSources>[0]): AppThunk =>
  (dispatch) =>
    dispatch(getSourcesAction(params));

const getUserAccessAction = (params: Parameters<typeof costService.getUserAccess>[0]) =>
  action(costConstants.GET_USER_ACCESS, costService.getUserAccess(params));

const getUserAccess =
  (params: Parameters<typeof costService.getUserAccess>[0]): AppThunk =>
  (dispatch) =>
    dispatch(getUserAccessAction(params));

const costActions = {
  getReport,
  getSources,
  getUserAccess,
};

type CostAction = ActionType<
  typeof getReportAction | typeof getSourcesAction | typeof getUserAccessAction
>;

export { costActions, getReport, getSources, getUserAccess, CostAction };
