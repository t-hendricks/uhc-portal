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
import { subscriptionsConstants } from '../constants';
import { accountsService, authorizationsService } from '../../services';
import { INVALIDATE_ACTION, buildPermissionDict } from '../reduxHelpers';

function fetchAccount() {
  return dispatch => dispatch({
    type: subscriptionsConstants.GET_ACCOUNT,
    payload: accountsService.getCurrentAccount(),
  });
}

const getSubscriptionsAndPermissions = async (params) => {
  let canEdit = [];
  const permissionsResponse = await authorizationsService.selfResourceReview(
    { action: 'update', resource_type: 'Cluster' },
  );
  canEdit = buildPermissionDict(permissionsResponse);

  return accountsService.getSubscriptions(params).then((response) => {
    response.data.items.forEach((subscription) => {
      // eslint-disable-next-line no-param-reassign
      subscription.canEdit = canEdit['*'] || !!canEdit[subscription.cluster_id];
    });
    return response;
  });
};

const getSubscriptions = params => dispatch => dispatch({
  type: subscriptionsConstants.GET_SUBSCRIPTIONS,
  payload: getSubscriptionsAndPermissions(params),
});

const invalidateSubscriptions = () => dispatch => dispatch({
  type: INVALIDATE_ACTION(subscriptionsConstants.GET_SUBSCRIPTIONS),
});

function fetchQuotaSummary(organizationID, params) {
  return dispatch => dispatch({
    type: subscriptionsConstants.GET_QUOTA_SUMMARY,
    payload: accountsService.getRequest(['quota_summary', organizationID], params),
  });
}

function fetchQuotaCost(organizationID) {
  return dispatch => dispatch({
    type: subscriptionsConstants.GET_QUOTA_COST,
    payload: accountsService.getOrganizationQuota(organizationID),
  });
}


const subscriptionsActions = {
  fetchAccount,
  fetchQuotaSummary,
  fetchQuotaCost,
  getSubscriptions,
  invalidateSubscriptions,
};

export {
  subscriptionsActions,
  fetchAccount,
  fetchQuotaSummary,
  fetchQuotaCost,
  getSubscriptions,
  invalidateSubscriptions,
};
