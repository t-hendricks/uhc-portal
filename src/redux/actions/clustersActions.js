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
import { clusterService, authorizationsService, accountsService } from '../../services';
import helpers from '../../common/helpers';
import { normalizeCluster } from '../../common/normalize';

const invalidateClusters = () => dispatch => dispatch({
  type: helpers.INVALIDATE_ACTION(clustersConstants.GET_CLUSTERS),
});

const createCluster = params => dispatch => dispatch({
  type: clustersConstants.CREATE_CLUSTER,
  payload: clusterService.postNewCluster(params).then((response) => {
    // TODO: this artificially delays CREATE_CLUSTER_FULLFILLED action
    // until after the INVALIDATE action.
    invalidateClusters()(dispatch);
    return response;
  }),
});

const registerDisconnectedCluster = params => dispatch => dispatch({
  type: clustersConstants.CREATE_CLUSTER,
  payload: clusterService.postDisconnectedCluster(params).then((response) => {
    // TODO: this artificially delays CREATE_CLUSTER_FULLFILLED action
    // until after the INVALIDATE action.
    invalidateClusters()(dispatch);
    return response;
  }),
});

const clearClusterResponse = () => dispatch => dispatch({
  type: clustersConstants.CLEAR_DISPLAY_NAME_RESPONSE,
});

const editCluster = (id, cluster) => dispatch => dispatch({
  type: clustersConstants.EDIT_CLUSTER,
  payload: clusterService.editCluster(id, cluster),
});

const editClusterDisplayName = (id, subscriptionID, displayName) => dispatch => dispatch({
  type: clustersConstants.EDIT_CLUSTER,
  payload: clusterService.editCluster(id, { display_name: displayName }).then(
    () => accountsService.editSubscription(subscriptionID, { display_name: displayName }),
  ),
});

/** Build a dict mapping a cluster ID to a specific permission state
 * @param {*} response - a response from selfResourceReview
 */
const buildPermissionDict = (response) => {
  const ret = {};
  if (!response || !response.data || !response.data.cluster_ids) {
    return ret;
  }
  response.data.cluster_ids.forEach((clusterID) => {
    ret[clusterID] = true;
  });
  return ret;
};

/**
 * Collect a list of object IDs and build a SQL-like query searching for these IDs.
 * For example, to collect subscription IDs from clusters, so we can query
 * for the subscription info.
 * @param {*} response A response containing a collection of items
 * @param {string} field The field containing the ID to collect for the search
 */
const buildSearchQuery = (response, field) => {
  const IDs = new Set();
  const items = get(response, 'data.items', []);
  items.forEach((item) => {
    const objectID = get(item, field);
    if (objectID) {
      IDs.add(`'${objectID}'`);
    }
  });
  if (IDs.length === 0) {
    return false;
  }
  return `id in (${Array.from(IDs).join(',')})`;
};

const fetchClustersAndPermissions = (clusterRequestParams) => {
  let subscriptions;
  let canEdit;
  let canDelete;

  const promises = [
    accountsService.getSubscriptions(clusterRequestParams).then((response) => {
      subscriptions = response;
    }),
    authorizationsService.selfResourceReview(
      { action: 'delete', resource_type: 'Cluster' },
    ).then((response) => { canDelete = buildPermissionDict(response); }),
    authorizationsService.selfResourceReview(
      { action: 'update', resource_type: 'Cluster' },
    ).then((response) => { canEdit = buildPermissionDict(response); }),
  ];
  return Promise.all(promises).then(() => {
    const clustersQuery = buildSearchQuery(subscriptions, 'cluster_id');
    if (!clustersQuery) {
      return subscriptions;
    }
    const subscriptionMap = {}; // map subscription ID to subscription info
    const subscriptionItems = get(subscriptions, 'data.items', []);
    for (let i = 0; i < subscriptionItems.length; i += 1) {
      // regular for loop, because we need the index
      subscriptionMap[subscriptionItems[i].cluster_id] = { data: subscriptionItems[i], order: i };
    }

    // fetch clusters by subscription
    return clusterService.getClusters(clustersQuery).then((response) => {
      const clusters = response;
      const sorted = [];

      clusters.data.items.forEach((rawCluster) => {
        const normalizedCluster = normalizeCluster(rawCluster);

        normalizedCluster.canEdit = canEdit['*'] || !!canEdit[normalizedCluster.id];
        normalizedCluster.canDelete = canDelete['*'] || !!canDelete[normalizedCluster.id];

        if (normalizedCluster.id && subscriptionMap[normalizedCluster.id]) {
          const subscriptionInfo = subscriptionMap[normalizedCluster.id];

          normalizedCluster.subscription = subscriptionInfo.data;
          sorted[subscriptionInfo.order] = normalizedCluster;
        }
      });
      clusters.data.items = sorted;
      clusters.data.page = subscriptions.data.page;
      clusters.data.total = subscriptions.data.total;
      return clusters;
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

const resetCreatedClusterResponse = () => dispatch => dispatch({
  type: clustersConstants.RESET_CREATED_CLUSTER_RESPONSE,
});

const clustersActions = {
  clearClusterResponse,
  createCluster,
  registerDisconnectedCluster,
  editCluster,
  fetchClusters,
  fetchClusterDetails,
  invalidateClusters,
  resetCreatedClusterResponse,
  editClusterDisplayName,
};

export {
  clustersActions,
  clearClusterResponse,
  createCluster,
  registerDisconnectedCluster,
  editCluster,
  fetchClusters,
  fetchClusterDetails,
  invalidateClusters,
  resetCreatedClusterResponse,
  editClusterDisplayName,
};
