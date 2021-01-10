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
import isUuid from 'uuid-validate';

import { clustersConstants } from '../constants';
import { accountsService, authorizationsService, clusterService } from '../../services';
import { INVALIDATE_ACTION, buildPermissionDict } from '../reduxHelpers';
import {
  normalizeCluster,
  fakeClusterFromSubscription,
  normalizeSubscription,
  mapListResponse,
} from '../../common/normalize';
import {
  postSchedule,
} from '../../components/clusters/common/Upgrades/clusterUpgradeActions';

import { editSubscriptionSettings } from './subscriptionSettingsActions';

const invalidateClusters = () => dispatch => dispatch({
  type: INVALIDATE_ACTION(clustersConstants.GET_CLUSTERS),
});

const createClusterAndUpgradeSchedule = async (cluster, upgradeSettings, dispatch) => {
  const clusterResponse = await clusterService.postNewCluster(cluster);
  if (upgradeSettings && upgradeSettings.upgrade_policy === 'automatic') {
    const clusterID = clusterResponse.data.id;
    dispatch(postSchedule(clusterID, {
      schedule_type: 'automatic',
      schedule: upgradeSettings.automatic_upgrade_schedule,
    }));
  }
  invalidateClusters()(dispatch);
  return clusterResponse;
};

const createCluster = (params, upgradeSettings) => dispatch => dispatch({
  type: clustersConstants.CREATE_CLUSTER,
  payload: createClusterAndUpgradeSchedule(params, upgradeSettings, dispatch),
});

const registerClusterAndUpdateSubscription = async (
  clusterRequest, subscriptionRequest, dispatch) => {
  const registerClusterResponse = await clusterService.postDisconnectedCluster(clusterRequest);

  if (subscriptionRequest && registerClusterResponse.status === 201) {
    dispatch(editSubscriptionSettings(registerClusterResponse.data.id, subscriptionRequest));
  }
  dispatch(invalidateClusters());
  return registerClusterResponse;
};

const registerDisconnectedCluster = (clusterRequest, subscriptionRequest) => dispatch => dispatch({
  type: clustersConstants.CREATE_CLUSTER,
  payload: registerClusterAndUpdateSubscription(clusterRequest, subscriptionRequest, dispatch),
});


const clearClusterResponse = () => dispatch => dispatch({
  type: clustersConstants.CLEAR_DISPLAY_NAME_RESPONSE,
});

const editCluster = (id, cluster) => dispatch => dispatch({
  type: clustersConstants.EDIT_CLUSTER,
  payload: clusterService.editCluster(id, cluster),
});

const editClusterDisplayName = (subscriptionID, displayName) => dispatch => dispatch({
  type: clustersConstants.EDIT_CLUSTER,
  payload: accountsService.editSubscription(subscriptionID, { display_name: displayName }),
});

/** Build a notification
 * Meta object with notifications. Notifications middleware uses it to get prepared to response to:
 * - <type>_PENDING (not used) - notification is sent right after the request was created
 * - <type>_FULFILLED - once promise is resolved
 * - <type>_PENDING (not used) - once promise is rejected
 *
 * @param {string} name - name of a cluster
 * @param {string} action - action to display notification for (archive/unarchive)
 * @returns {object} - notification object
 *
 * @see https://github.com/RedHatInsights/frontend-components/blob/master/packages/notifications/doc/notifications.md
 */
const buildNotificationsMeta = (name, action) => ({
  notifications: {
    fulfilled: {
      variant: 'success',
      title: `Cluster ${name} has been ${action}d`,
      dismissDelay: 8000,
      dismissable: false,
    },
  },
});

const archiveCluster = (id, name) => dispatch => dispatch({
  type: clustersConstants.ARCHIVE_CLUSTER,
  payload: clusterService.archiveCluster(id),
  meta: buildNotificationsMeta(name, 'archive'),
});

const clearClusterArchiveResponse = () => dispatch => dispatch({
  type: clustersConstants.CLEAR_CLUSTER_ARCHIVE_RESPONSE,
});

const unarchiveCluster = (id, name) => dispatch => dispatch({
  type: clustersConstants.UNARCHIVE_CLUSTER,
  payload: clusterService.unarchiveCluster(id),
  meta: buildNotificationsMeta(name, 'unarchive'),
});

const clearClusterUnarchiveResponse = () => dispatch => dispatch({
  type: clustersConstants.CLEAR_CLUSTER_UNARCHIVE_RESPONSE,
});


const editClusterConsoleURL = (id, subscriptionID, consoleURL) => dispatch => dispatch({
  type: clustersConstants.EDIT_CLUSTER,
  payload: clusterService.editCluster(id, { console: { url: consoleURL } }).then(
    () => accountsService.editSubscription(subscriptionID, { console_url: consoleURL }),
  ),
});

/**
 * Collect a list of object IDs and build a SQL-like query searching for these IDs.
 * For example, to collect subscription IDs from clusters, so we can query
 * for the subscription info.
 * @param {*} items A collection of items
 * @param {string} field The field containing the ID to collect for the search
 */
const buildSearchQuery = (items, field) => {
  const IDs = new Set();
  items.forEach((item) => {
    const objectID = item[field];
    if (objectID) {
      IDs.add(`'${objectID}'`);
    }
  });
  return `id in (${Array.from(IDs).join(',')})`;
};

const createResponseForFetchClusters = (subscriptionMap, canEdit, canDelete) => {
  const result = [];
  subscriptionMap.forEach((value) => {
    let cluster;
    if (value.subscription.managed) {
      if (value?.cluster === null) {
        // skip OSD cluster without data
        return;
      }
      cluster = normalizeCluster(value.cluster);
    } else {
      cluster = fakeClusterFromSubscription(value.subscription);
    }
    cluster.canEdit = canEdit['*'] || !!canEdit[cluster.id];
    cluster.canDelete = canDelete['*'] || !!canDelete[cluster.id];
    cluster.subscription = value.subscription;
    result.push(cluster);
  });
  return result;
};

const fetchClustersAndPermissions = (clusterRequestParams) => {
  let subscriptions;
  let canEdit;
  let canDelete;

  const promises = [
    accountsService.getSubscriptions(clusterRequestParams).then((response) => {
      subscriptions = mapListResponse(response, normalizeSubscription);
    }),
    authorizationsService.selfResourceReview(
      { action: 'delete', resource_type: 'Cluster' },
    ).then((response) => { canDelete = buildPermissionDict(response); }),
    authorizationsService.selfResourceReview(
      { action: 'update', resource_type: 'Cluster' },
    ).then((response) => { canEdit = buildPermissionDict(response); }),
  ];
  return Promise.all(promises)
    .then(() => {
      const items = subscriptions?.data?.items;
      if (!items) {
        return subscriptions;
      }

      // map subscription ID to subscription info
      // Note: Map keeps order of insertions
      const subscriptionMap = new Map();
      items.forEach(item => subscriptionMap.set(item.cluster_id, {
        subscription: item,
      }));

      // clusters-service only needed for managed clusters.
      const managedSubsriptions = items.filter(s => s.managed);
      if (managedSubsriptions.length === 0) {
        return {
          data: {
            items: createResponseForFetchClusters(subscriptionMap, canEdit, canDelete),
            page: subscriptions.data.page,
            total: subscriptions.data.total || 0,
            queryParams: { ...clusterRequestParams },
          },
        };
      }

      // fetch managed clusters by subscription
      const clustersQuery = buildSearchQuery(managedSubsriptions, 'cluster_id');
      return clusterService.getClusters(clustersQuery)
        .then((response) => {
          const clusters = response?.data?.items;
          clusters.forEach((cluster) => {
            const entry = subscriptionMap.get(cluster.id);
            if (entry !== undefined) {
              // store cluster into subscription map
              entry.cluster = cluster;
              subscriptionMap.set(cluster.id, entry);
            }
          });
          return {
            data: {
              items: createResponseForFetchClusters(subscriptionMap, canEdit, canDelete),
              page: subscriptions.data.page,
              total: subscriptions.data.total || 0,
              queryParams: { ...clusterRequestParams },
            },
          };
        });
    });
};

const fetchClusters = params => dispatch => dispatch({
  type: clustersConstants.GET_CLUSTERS,
  payload: fetchClustersAndPermissions(params),
});

const fetchSingleClusterAndPermissions = (clusterID) => {
  let cluster;
  let canEdit;
  let canDelete;
  const clusterIdIsUUID = isUuid(clusterID);
  const clusterPromise = clusterIdIsUUID ? clusterService.fetchClusterByExternalId(clusterID)
    : clusterService.getClusterDetails(clusterID);
  // fetchClusterByExternalId returns an array. getClusterDetails returns a single cluster
  return clusterPromise.then((clusterResponse) => {
    cluster = clusterIdIsUUID ? { data: get(clusterResponse, 'data.items[0]') } : clusterResponse;
    if (clusterIdIsUUID && !cluster.data) {
      // create a fake 404 error so 404 handling in components will work as if it was a regular 404.
      const error = Error('Cluster not found');
      error.response = { status: 404 };
      return Promise.reject(error);
    }
    cluster.data = normalizeCluster(cluster.data);
    const promises = [
      authorizationsService.selfAccessReview(
        { action: 'delete', resource_type: 'Cluster', cluster_id: clusterID },
      ).then((response) => { canDelete = response.data.allowed; }),
      authorizationsService.selfAccessReview(
        { action: 'update', resource_type: 'Cluster', cluster_id: clusterID },
      ).then((response) => { canEdit = response.data.allowed; }),
    ];
    return Promise.all(promises).then(() => {
      cluster.data.shouldRedirect = clusterIdIsUUID;
      cluster.data.canEdit = canEdit;
      cluster.data.canDelete = canDelete;
      const subscriptionID = get(cluster.data, 'subscription.id');
      if (subscriptionID) {
        return accountsService.getSubscription(subscriptionID).then((subscription) => {
          cluster.data.subscription = subscription.data;
          if (subscription.data.metrics !== undefined && subscription.data.metrics.length > 0) {
            [cluster.data.metrics] = subscription.data.metrics;
          }
          if (!cluster.managed && !cluster?.console?.url) {
            cluster.console = { url: cluster.data.subscription.console_url };
          }
          return cluster;
        }).catch(() => cluster);
      }

      return cluster;
    }).catch(() => cluster);
  });
};

const fetchClusterDetails = clusterID => dispatch => dispatch({
  type: clustersConstants.GET_CLUSTER_DETAILS,
  payload: fetchSingleClusterAndPermissions(clusterID),
});

const setClusterDetails = (cluster, mergeDetails = false) => dispatch => dispatch({
  type: clustersConstants.SET_CLUSTER_DETAILS,
  payload: { cluster, mergeDetails },
});

const resetCreatedClusterResponse = () => dispatch => dispatch({
  type: clustersConstants.RESET_CREATED_CLUSTER_RESPONSE,
});

const getClusterStatus = clusterID => dispatch => dispatch({
  type: clustersConstants.GET_CLUSTER_STATUS,
  payload: clusterService.getClusterStatus(clusterID),
});

const clustersActions = {
  clearClusterResponse,
  createCluster,
  registerDisconnectedCluster,
  editCluster,
  fetchClusters,
  fetchClusterDetails,
  setClusterDetails,
  invalidateClusters,
  resetCreatedClusterResponse,
  editClusterDisplayName,
  archiveCluster,
  unarchiveCluster,
  getClusterStatus,
};

export {
  clustersActions,
  clearClusterResponse,
  createCluster,
  registerDisconnectedCluster,
  editCluster,
  fetchClusters,
  fetchClusterDetails,
  setClusterDetails,
  invalidateClusters,
  resetCreatedClusterResponse,
  editClusterDisplayName,
  archiveCluster,
  clearClusterArchiveResponse,
  unarchiveCluster,
  clearClusterUnarchiveResponse,
  editClusterConsoleURL,
  getClusterStatus,
};
