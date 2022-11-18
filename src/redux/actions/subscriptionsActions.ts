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
import { action, ActionType } from 'typesafe-actions';
import type { AxiosResponse } from 'axios';

import { subscriptionsConstants } from '../constants';
import { accountsService, authorizationsService, clusterService } from '../../services';
import { INVALIDATE_ACTION, buildPermissionDict } from '../reduxHelpers';
import { SelfResourceReviewRequest } from '../../types/authorizations.v1/models/SelfResourceReviewRequest';
import type { SubscriptionWithPermissionsList } from '../../types/types';

const fetchAccount = () =>
  action(subscriptionsConstants.GET_ACCOUNT, accountsService.getCurrentAccount());

const getSubscriptionsAndPermissions = async (
  params: Parameters<typeof accountsService.getSubscriptions>[0],
) => {
  let canEdit: { [clusterID: string]: boolean } = {};
  const permissionsResponse = await authorizationsService.selfResourceReview({
    action: SelfResourceReviewRequest.action.UPDATE,
    resource_type: SelfResourceReviewRequest.resource_type.CLUSTER,
  });
  canEdit = buildPermissionDict(permissionsResponse);

  return (
    accountsService
      .getSubscriptions(params)
      // augmenting the SubscriptionList with permissions
      .then((response: AxiosResponse<SubscriptionWithPermissionsList>) => {
        response.data.items?.forEach((subscription) => {
          // TODO should avoid augmenting response types
          // eslint-disable-next-line no-param-reassign
          subscription.canEdit =
            canEdit['*'] || (!!subscription.cluster_id && !!canEdit[subscription.cluster_id]);
        });
        return response;
      })
  );
};

const getSubscriptions = (params: Parameters<typeof accountsService.getSubscriptions>[0]) =>
  action(subscriptionsConstants.GET_SUBSCRIPTIONS, getSubscriptionsAndPermissions(params));

const invalidateSubscriptions = () =>
  action(INVALIDATE_ACTION(subscriptionsConstants.GET_SUBSCRIPTIONS));

const fetchQuotaCost = (organizationID: string) =>
  action(
    subscriptionsConstants.GET_QUOTA_COST,
    accountsService.getOrganizationQuota(organizationID),
  );

const getSubscriptionIDForCluster = (clusterID: string) => {
  if (isUuid(clusterID)) {
    return accountsService
      .fetchSubscriptionByExternalId(clusterID)
      .then((result) => result.data?.items?.[0]?.id);
  }
  return clusterService.getClusterDetails(clusterID).then((result) => result.data.subscription?.id);
};

/**
 * Redux action creator, get a subscription ID using a cluster's id / uuid,
 * for redirecting requests from `/details/<id>` to `/details/s/<subscription_id>`
 *
 * @param {String} clusterID Either a Clusters Service cluster ID or a cluster's external_id (uuid)
 */
const fetchSubscriptionIDForCluster = (clusterID: string) =>
  action(subscriptionsConstants.GET_SUBSCRIPTION_ID, getSubscriptionIDForCluster(clusterID));

const clearSubscriptionIDForCluster = () => action(subscriptionsConstants.CLEAR_SUBSCRIPTION_ID);

const subscriptionsActions = {
  fetchAccount,
  fetchQuotaCost,
  getSubscriptions,
  invalidateSubscriptions,
  fetchSubscriptionIDForCluster,
  clearSubscriptionIDForCluster,
};

type SubscriptionsAction = ActionType<typeof subscriptionsActions>;

export {
  subscriptionsActions,
  fetchAccount,
  fetchQuotaCost,
  getSubscriptions,
  invalidateSubscriptions,
  fetchSubscriptionIDForCluster,
  clearSubscriptionIDForCluster,
  SubscriptionsAction,
};
