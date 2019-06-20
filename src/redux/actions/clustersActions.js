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
import result from 'lodash/result';

import { clustersConstants } from '../constants';
import { clusterService, authorizationsService, accountsService } from '../../services';
import helpers from '../../common/helpers';
import { normalizeCluster } from '../../common/normalize';

const invalidateClusters = () => (dispatch) => {
  dispatch({
    type: helpers.INVALIDATE_ACTION(clustersConstants.GET_CLUSTERS),
  });
  dispatch({
    type: helpers.INVALIDATE_ACTION(clustersConstants.GET_CLUSTER_ROUTER_SHARDS),
  });
};

const createCluster = params => dispatch => dispatch({
  type: clustersConstants.CREATE_CLUSTER,
  payload: clusterService.postNewCluster(params).then((response) => {
    // TODO: this artificially delays CREATE_CLUSTER_FULLFILLED action
    // until after the INVALIDATE action.
    invalidateClusters()(dispatch);
    return response;
  }),
});

const clearClusterResponse = () => (dispatch) => {
  dispatch({
    type: clustersConstants.CLEAR_DISPLAY_NAME_RESPONSE,
  });
  dispatch({
    type: clustersConstants.CLEAR_ROUTER_SHARD_RESPONSE,
  });
};

const editCluster = (id, cluster) => dispatch => dispatch({
  type: clustersConstants.EDIT_CLUSTER,
  payload: clusterService.editCluster(id, cluster),
});

const editClusterWithResources = (id, updates) => dispatch => dispatch({
  type: clustersConstants.EDIT_CLUSTER,
  payload: () => {
    const responses = [];
    // This chains all requests as sequential promises to avoid race
    // conditions and 409 Conflicts when dealing with multiple updates
    // to the same resource type (e.g. Router Shards).
    return updates.reduce((p, update) => p.then(() => {
      const fn = clusterService[update.action](id, ...update.args);
      return fn.then((response) => {
        responses.push(response);
        return responses;
      });
    }), Promise.resolve());
  },
});

const fetchClustersAndPermissions = (clusterRequestParams) => {
  let clusters;
  let canEdit;
  let canDelete;
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

  const buildSearchQuery = (response, field) => {
    const IDs = new Set();
    response.data.items.forEach((cluster) => {
      const subscriptionID = result(cluster, field);
      if (subscriptionID) {
        IDs.add(`'${subscriptionID}'`);
      }
    });
    if (IDs.length === 0) {
      return false;
    }
    return `id in (${Array.from(IDs).join(',')})`;
  };

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
      const subscription = result(cluster, 'subscription.id');
      if (subscription) {
        subscriptionMap[subscription] = i;
      }
    }
    if (clusters.data.items.length > 0) {
      // We got clusters, so we need to find their subscriptions and accounts
      const query = buildSearchQuery(clusters, 'subscription.id');
      if (!query) {
        // Guard against cases in which all clusters have no subscription info.
        return clusters;
      }
      return accountsService.getSubscriptions(query).then((response) => {
        // Enrich cluster results with subscription information
        response.data.items.forEach((subscriptionItem) => {
          const index = subscriptionMap[subscriptionItem.id];
          clusters.data.items[index].subscriptionInfo = subscriptionItem;
        });
        return clusters;
      }).catch(() => clusters); // catch to return clusters even if subscription query fails
    }
    // return empty result.
    return clusters;
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
    const subscriptionID = result(cluster.data, 'subscription.id');
    if (subscriptionID) {
      // FIXME accounts service does not support fetching account info for a single
      // subscription, so we have to use the search endpoint here
      return accountsService.getSubscriptions(`id='${subscriptionID}'`).then((subscriptions) => {
        cluster.data.subscriptionInfo = result(subscriptions, 'data.items[0]');
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

const fetchClusterRouterShards = clusterID => dispatch => dispatch({
  type: clustersConstants.GET_CLUSTER_ROUTER_SHARDS,
  payload: clusterService.getClusterRouterShards(clusterID),
});

const resetCreatedClusterResponse = () => dispatch => dispatch({
  type: clustersConstants.RESET_CREATED_CLUSTER_RESPONSE,
});

const clustersActions = {
  clearClusterResponse,
  createCluster,
  editCluster,
  editClusterWithResources,
  fetchClusters,
  fetchClusterDetails,
  fetchClusterRouterShards,
  invalidateClusters,
  resetCreatedClusterResponse,
};

export {
  clustersActions,
  clearClusterResponse,
  createCluster,
  editCluster,
  editClusterWithResources,
  fetchClusters,
  fetchClusterDetails,
  fetchClusterRouterShards,
  invalidateClusters,
  resetCreatedClusterResponse,
};
