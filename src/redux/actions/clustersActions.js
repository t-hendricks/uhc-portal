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

const clearClusterResponse = () => dispatch => dispatch({
  type: clustersConstants.CLEAR_DISPLAY_NAME_RESPONSE,
});

const editCluster = (id, cluster) => dispatch => dispatch({
  type: clustersConstants.EDIT_CLUSTER,
  payload: clusterService.editCluster(id, cluster),
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

const fetchClustersAndPermissions = (clusterRequestParams, subscriptions) => {
  let clusters;
  let canEdit;
  let canDelete;

  const promises = [
    clusterService.getClusters(clusterRequestParams).then((response) => {
      clusters = response;
      clusters.data.items = clusters.data.items.map(normalizeCluster);
    }),
    authorizationsService.selfResourceReview(
      { action: 'delete', resource_type: 'Cluster' },
    ).then((response) => { canDelete = buildPermissionDict(response); }),
    authorizationsService.selfResourceReview(
      { action: 'update', resource_type: 'Cluster' },
    ).then((response) => { canEdit = buildPermissionDict(response); }),
  ];
  return Promise.all(promises).then(() => {
    const subscriptionMap = {}; // map subscription ID to cluster index
    for (let i = 0; i < clusters.data.items.length; i += 1) {
      const cluster = clusters.data.items[i];
      clusters.data.items[i].canEdit = canEdit['*'] || !!canEdit[cluster.id];
      clusters.data.items[i].canDelete = canDelete['*'] || !!canDelete[cluster.id];
      const subscriptionID = get(cluster, 'subscription.id');
      if (subscriptionID) {
        if (!subscriptions) {
          // we don't have subscriptions yet.
          // Add this to the map, so we can fetch subscriptions later
          subscriptionMap[subscriptionID] = i;
        } else {
          // We got subscriptions as a parameter, enrich the cluster with the subscription info
          clusters.data.items[i].subscription = subscriptions[subscriptionID];
        }
      }
    }

    if (!subscriptions && clusters.data.items.length > 0) {
      // We got clusters, so we need to find their subscriptions and accounts
      const query = buildSearchQuery(clusters, 'subscription.id');
      if (query) {
        return accountsService.getSubscriptions(query).then((response) => {
          // Enrich cluster results with subscription information
          response.data.items.forEach((subscriptionItem) => {
            const index = subscriptionMap[subscriptionItem.id];
            clusters.data.items[index].subscription = subscriptionItem;
          });
          return clusters;
        }).catch(() => clusters); // catch to return clusters even if subscription query fails
      }
    }

    return clusters;
  });
};

const fetchClustersBySubscription = requestParams => accountsService.getSubscriptions(
  requestParams.subscriptionFilter,
).then(
  (response) => {
    const clustersQuery = buildSearchQuery(response, 'cluster_id');
    if (!clustersQuery) {
      return response;
    }
    const params = {
      ...requestParams,
      filter: requestParams.filter ? `${clustersQuery} AND (${requestParams.filter})` : clustersQuery,
    };
      // convert the subscription list into a id -> subscription map
    const subscriptions = {};
    get(response, 'data.items', []).forEach((subscription) => {
      subscriptions[subscription.id] = subscription;
    });
    return fetchClustersAndPermissions(params, subscriptions);
  },
);

const fetchClusters = params => dispatch => dispatch({
  type: clustersConstants.GET_CLUSTERS,
  payload: params.subscriptionFilter
    ? fetchClustersBySubscription(params)
    : fetchClustersAndPermissions(params),
});

const fetchSingleClusterAndPermissions = (clusterID) => {
  let cluster;
  let canEdit;
  let canDelete;
  const promises = [
    clusterService.getClusterDetails(clusterID).then((response) => {
      cluster = response;
      cluster.data = normalizeCluster(cluster.data);
    }),
    authorizationsService.selfAccessReview(
      { action: 'delete', resource_type: 'Cluster', cluster_id: clusterID },
    ).then((response) => { canDelete = response.data.allowed; }),
    authorizationsService.selfAccessReview(
      { action: 'update', resource_type: 'Cluster', cluster_id: clusterID },
    ).then((response) => { canEdit = response.data.allowed; }),
  ];
  return Promise.all(promises).then(() => {
    cluster.data.canEdit = canEdit;
    cluster.data.canDelete = canDelete;
    const subscriptionID = get(cluster.data, 'subscription.id');
    if (subscriptionID) {
      // FIXME accounts service does not support fetching account info for a single
      // subscription, so we have to use the search endpoint here
      return accountsService.getSubscriptions(`id='${subscriptionID}'`).then((subscriptions) => {
        cluster.data.subscription = get(subscriptions, 'data.items[0]');
        return cluster;
      }).catch(() => cluster);
    }
    return cluster;
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
  editCluster,
  fetchClusters,
  fetchClusterDetails,
  invalidateClusters,
  resetCreatedClusterResponse,
};

export {
  clustersActions,
  clearClusterResponse,
  createCluster,
  editCluster,
  fetchClusters,
  fetchClusterDetails,
  invalidateClusters,
  resetCreatedClusterResponse,
};
