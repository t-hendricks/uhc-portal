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
import { validate as isUuid } from 'uuid';

import { subscriptionsConstants } from '../constants';
import { accountsService, authorizationsService, clusterService } from '../../services';
import { INVALIDATE_ACTION, buildPermissionDict } from '../reduxHelpers';

function fetchAccount() {
  return (dispatch) =>
    dispatch({
      type: subscriptionsConstants.GET_ACCOUNT,
      payload: accountsService.getCurrentAccount(),
    });
}

const getSubscriptionsAndPermissions = async (params) => {
  let canEdit = [];
  const permissionsResponse = await authorizationsService.selfResourceReview({
    action: 'update',
    resource_type: 'Cluster',
  });
  canEdit = buildPermissionDict(permissionsResponse);

  return accountsService.getSubscriptions(params).then((response) => {
    response.data.items.forEach((subscription) => {
      // eslint-disable-next-line no-param-reassign
      subscription.canEdit = canEdit['*'] || !!canEdit[subscription.cluster_id];
    });
    return response;
  });
};

const getSubscriptions = (params) => (dispatch) =>
  dispatch({
    type: subscriptionsConstants.GET_SUBSCRIPTIONS,
    payload: getSubscriptionsAndPermissions(params),
  });

const invalidateSubscriptions = () => (dispatch) =>
  dispatch({
    type: INVALIDATE_ACTION(subscriptionsConstants.GET_SUBSCRIPTIONS),
  });

function fetchQuotaCost(organizationID) {
  return (dispatch) =>
    dispatch({
      type: subscriptionsConstants.GET_QUOTA_COST,
      payload: accountsService.getOrganizationQuota(organizationID),
    });
}

const getSubscriptionIDForCluster = (clusterID) => {
  if (isUuid(clusterID)) {
    return accountsService
      .fetchSubscriptionByExternalId(clusterID)
      .then((result) => result.data?.items[0]?.id);
  }
  return clusterService.getClusterDetails(clusterID).then((result) => result.data.subscription.id);
};

/**
 * Redux action creator, get a subscription ID using a cluster's id / uuid,
 * for redirecting requests from `/details/<id>` to `/details/s/<subscription_id>`
 *
 * @param {String} clusterID Either a Clusters Service cluster ID or a cluster's external_id (uuid)
 */
const fetchSubscriptionIDForCluster = (clusterID) => (dispatch) =>
  dispatch({
    type: subscriptionsConstants.GET_SUBSCRIPTION_ID,
    payload: getSubscriptionIDForCluster(clusterID),
  });

const clearSubscriptionIDForCluster = () => (dispatch) =>
  dispatch({
    type: subscriptionsConstants.CLEAR_SUBSCRIPTION_ID,
  });

const subscriptionsActions = {
  fetchAccount,
  fetchQuotaCost,
  getSubscriptions,
  invalidateSubscriptions,
  fetchSubscriptionIDForCluster,
  clearSubscriptionIDForCluster,
};

export {
  subscriptionsActions,
  fetchAccount,
  fetchQuotaCost,
  getSubscriptions,
  invalidateSubscriptions,
  fetchSubscriptionIDForCluster,
  clearSubscriptionIDForCluster,
};
