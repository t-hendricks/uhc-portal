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
import { action, ActionType } from 'typesafe-actions';
import { subscriptionSettingsConstants } from '../constants';
import { accountsService } from '../../services';
import type { SubscriptionPatchRequest } from '../../types/accounts_mgmt.v1/models/SubscriptionPatchRequest';
import type { AppThunk } from '../types';

const editSubscriptionSettingsAction = (subscriptionID: string, data: SubscriptionPatchRequest) =>
  action(
    subscriptionSettingsConstants.EDIT_SUBSCRIPTION_SETTINGS,
    accountsService.editSubscription(subscriptionID, data),
  );

const editSubscriptionSettings =
  (subscriptionID: string, data: SubscriptionPatchRequest): AppThunk =>
  (dispatch) =>
    dispatch(editSubscriptionSettingsAction(subscriptionID, data));

const clearEditSubscriptionSettingsResponseAction = () =>
  action(subscriptionSettingsConstants.CLEAR_EDIT_SUBSCRIPTION_SETTINGS_RESPONSE);

const clearEditSubscriptionSettingsResponse = (): AppThunk => (dispatch) =>
  dispatch(clearEditSubscriptionSettingsResponseAction());

const subscriptionSettingsActions = {
  editSubscriptionSettings,
  clearEditSubscriptionSettingsResponse,
};

type SubscriptionSettingsAction = ActionType<
  typeof editSubscriptionSettingsAction | typeof clearEditSubscriptionSettingsResponseAction
>;

export {
  subscriptionSettingsActions,
  editSubscriptionSettings,
  clearEditSubscriptionSettingsResponse,
  SubscriptionSettingsAction,
};
