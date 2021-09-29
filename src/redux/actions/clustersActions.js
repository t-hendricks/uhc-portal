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
import isEmpty from 'lodash/isEmpty';

import { clustersConstants } from '../constants';
import {
  accountsService, assistedService, authorizationsService, clusterService,
} from '../../services';
import { INVALIDATE_ACTION, buildPermissionDict } from '../reduxHelpers';
import { subscriptionStatuses } from '../../common/subscriptionTypes';
import {
  normalizeCluster,
  fakeClusterFromSubscription,
  fakeAIClusterFromSubscription,
  normalizeSubscription,
  mapListResponse,
  normalizeMetrics,
} from '../../common/normalize';
import {
  postSchedule,
} from '../../components/clusters/common/Upgrades/clusterUpgradeActions';
import { editSubscriptionSettings } from './subscriptionSettingsActions';
import isAssistedInstallSubscription from '../../common/isAssistedInstallerCluster';
import { ASSISTED_INSTALLER_MERGE_LISTS_FEATURE } from '../constants/featureConstants';

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
  registrationRequest, subscriptionRequest, dispatch,
) => {
  const registerClusterResponse = await accountsService.registerDisconnected(registrationRequest);

  if (subscriptionRequest && registerClusterResponse.status === 201) {
    dispatch(editSubscriptionSettings(registerClusterResponse.data.id, subscriptionRequest));
  }
  dispatch(invalidateClusters());
  return registerClusterResponse;
};

const registerDisconnectedCluster = (registrationRequest, subscriptionRequest) => dispatch => (
  dispatch({
    type: clustersConstants.CREATE_CLUSTER,
    payload: registerClusterAndUpdateSubscription(
      registrationRequest, subscriptionRequest, dispatch,
    ),
  })
);

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

const upgradeTrialCluster = (id, params) => dispatch => dispatch({
  type: clustersConstants.UPGRADE_TRIAL_CLUSTER,
  payload: clusterService.upgradeTrialCluster(id, params),
});

const clearUpgradeTrialClusterResponse = () => dispatch => dispatch({
  type: clustersConstants.CLEAR_UPGRADE_TRIAL_CLUSTER_RESPONSE,
});

const hibernateCluster = id => dispatch => dispatch({
  type: clustersConstants.HIBERNATE_CLUSTER,
  payload: clusterService.hibernateCluster(id),
});

const clearHibernateClusterResponse = () => dispatch => dispatch({
  type: clustersConstants.CLEAR_CLUSTER_HIBERNATE_RESPONSE,
});

const resumeCluster = id => dispatch => dispatch({
  type: clustersConstants.RESUME_CLUSTER,
  payload: clusterService.resumeCluster(id),
});

const clearResumeClusterResponse = () => dispatch => dispatch({
  type: clustersConstants.CLEAR_RESUME_CLUSTER_RESPONSE,
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
  subscriptionMap.forEach((entry) => {
    let cluster;
    if (entry.subscription.managed
      && entry.subscription.status !== subscriptionStatuses.DEPROVISIONED
      && !!entry?.cluster && !isEmpty(entry?.cluster)) {
      // managed cluster, with data from Clusters Service
      cluster = normalizeCluster(entry.cluster);
      cluster.metrics = normalizeMetrics(entry.subscription.metrics);
    } else {
      cluster = isAssistedInstallSubscription(entry.subscription)
        ? fakeAIClusterFromSubscription(entry.subscription, entry.cluster)
        : fakeClusterFromSubscription(entry.subscription);
    }

    // mark this as a clusters service cluster with partial data (happens when CS is down)
    cluster.partialCS = cluster.managed && (!entry?.cluster || isEmpty(entry?.cluster));

    cluster.canEdit = !cluster.partialCS && ((canEdit['*'] || !!canEdit[cluster.id]) && entry.subscription.status !== subscriptionStatuses.DEPROVISIONED);
    cluster.canDelete = !cluster.partialCS && (canDelete['*'] || !!canDelete[cluster.id]);
    cluster.subscription = entry.subscription;
    result.push(cluster);
  });
  return result;
};

const fetchClustersAndPermissions = (clusterRequestParams, aiMergeListsFeatureFlag) => {
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
      const items = subscriptions?.data?.items.filter(
        item => aiMergeListsFeatureFlag || !isAssistedInstallSubscription(item),
      );

      if (!items) {
        return subscriptions;
      }

      // map subscription ID to subscription info
      // Note: Map keeps order of insertions
      const subscriptionMap = new Map();
      items.forEach(item => subscriptionMap.set(item.cluster_id, {
        subscription: item,
      }));

      const enrichForClusterService = () => {
        // clusters-service only needed for managed clusters.
        const managedSubsriptions = items.filter(s => s.managed
          && s.status !== subscriptionStatuses.DEPROVISIONED);
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
                meta: {
                  clustersServiceError: false,
                },
              },
            };
          }).catch(e => ({
            // When clusters service is down, return AMS data only
            data: {
              items: createResponseForFetchClusters(subscriptionMap, canEdit, canDelete),
              page: subscriptions.data.page,
              total: subscriptions.data.total || 0,
              queryParams: { ...clusterRequestParams },
              meta: {
                clustersServiceError: e,
              },
            },
          }));
      };

      const aiPromises = [];
      if (aiMergeListsFeatureFlag) {
        subscriptionMap.forEach((value, clusterId) => {
          if (isAssistedInstallSubscription(value.subscription)) {
            /* TODO(mlibra): query all just-needed AI clusters at once, filter by subscription ID
                Requires: https://issues.redhat.com/browse/MGMT-5259)
            */
            aiPromises.push(assistedService.getAICluster(clusterId).then((res) => {
              const entry = subscriptionMap.get(clusterId);
              entry.cluster = res?.data; // The AI cluster
              subscriptionMap.set(clusterId, entry);
            }));
          }
        });
      }

      return Promise.allSettled(aiPromises).then(enrichForClusterService);
    });
};

const fetchClusters = params => (dispatch, getState) => dispatch({
  type: clustersConstants.GET_CLUSTERS,
  payload: fetchClustersAndPermissions(
    params,
    getState().features[ASSISTED_INSTALLER_MERGE_LISTS_FEATURE],
  ),
});

const fetchSingleClusterAndPermissions = async (subscriptionID) => {
  let canEdit;
  const subscription = await accountsService.getSubscription(subscriptionID);
  subscription.data = normalizeSubscription(subscription.data);

  if (subscription.data.status !== subscriptionStatuses.DEPROVISIONED) {
    await authorizationsService.selfAccessReview(
      { action: 'update', resource_type: 'Subscription', subscription_id: subscriptionID },
    ).then((response) => { canEdit = response.data.allowed; });
  }

  if (subscription.data.managed
    && subscription.data.status !== subscriptionStatuses.DEPROVISIONED) {
    const cluster = await clusterService.getClusterDetails(subscription.data.cluster_id);
    cluster.data = normalizeCluster(cluster.data);
    const canDeleteAccessReviewResponse = await authorizationsService.selfAccessReview(
      { action: 'delete', resource_type: 'Cluster', cluster_id: subscription.data.cluster_id },
    );

    cluster.data.canEdit = canEdit;
    cluster.data.canDelete = !!canDeleteAccessReviewResponse?.data?.allowed;
    if (subscription.data.metrics !== undefined) {
      [cluster.data.metrics] = subscription.data.metrics; // take metrics from AMS (even for OSD)
    }
    cluster.data.metrics = normalizeMetrics(cluster.data.metrics);

    // TODO later, refactor, this should return subscription as the base resource
    cluster.data.subscription = subscription.data;
    return cluster;
  }

  const cluster = {};
  if (isAssistedInstallSubscription(subscription.data)) {
    try {
      const aiCluster = await assistedService.getAICluster(subscription.data.cluster_id);
      cluster.data = fakeAIClusterFromSubscription(subscription.data, aiCluster?.data || null);
      cluster.data.aiCluster = aiCluster.data;
    } catch (e) {
      if (e.response?.status === 404) {
        // The cluster is garbage collected or the user does not have privileges
        // eslint-disable-next-line no-console
        console.info('Failed to query assisted-installer cluster id: ', subscription.data.cluster_id);
        cluster.data = fakeClusterFromSubscription(subscription.data);
      } else {
        throw e;
      }
    }
  } else {
    cluster.data = fakeClusterFromSubscription(subscription.data);
  }

  cluster.data.canEdit = canEdit;
  cluster.data.canDelete = false; // OCP clusters can't be deleted
  cluster.data.subscription = subscription.data;
  return cluster;
};

const fetchClusterDetails = subscriptionID => (dispatch) => {
  dispatch({
    type: clustersConstants.GET_CLUSTER_DETAILS,
    payload: fetchSingleClusterAndPermissions(subscriptionID),
  });
};

const setClusterDetails = (cluster, mergeDetails = false) => dispatch => dispatch({
  type: clustersConstants.SET_CLUSTER_DETAILS,
  payload: { cluster, mergeDetails },
});

const clearClusterDetails = () => dispatch => dispatch({
  type: clustersConstants.CLEAR_CLUSTER_DETAILS,
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
  clearClusterDetails,
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
  hibernateCluster,
  clearHibernateClusterResponse,
  resumeCluster,
  clearResumeClusterResponse,
  archiveCluster,
  clearClusterArchiveResponse,
  unarchiveCluster,
  clearClusterUnarchiveResponse,
  editClusterConsoleURL,
  getClusterStatus,
  upgradeTrialCluster,
  clearUpgradeTrialClusterResponse,
};
