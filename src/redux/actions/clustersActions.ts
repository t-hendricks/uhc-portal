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
import * as Sentry from '@sentry/browser';
import isEmpty from 'lodash/isEmpty';
import { action, ActionType } from 'typesafe-actions';
import type { AxiosError, AxiosResponse } from 'axios';
import type { OCM } from 'openshift-assisted-ui-lib';

import { clustersConstants } from '../constants';
import {
  accountsService,
  assistedService,
  authorizationsService,
  clusterService,
} from '../../services';
import { INVALIDATE_ACTION, buildPermissionDict } from '../reduxHelpers';
import { subscriptionStatuses, knownProducts } from '../../common/subscriptionTypes';
import {
  normalizeCluster,
  fakeClusterFromSubscription,
  fakeAIClusterFromSubscription,
  normalizeSubscription,
  mapListResponse,
  normalizeMetrics,
} from '../../common/normalize';
import { postSchedule } from '../../components/clusters/common/Upgrades/clusterUpgradeActions';
import { editSubscriptionSettings } from './subscriptionSettingsActions';
import isAssistedInstallSubscription from '../../common/isAssistedInstallerCluster';
import { ASSISTED_INSTALLER_MERGE_LISTS_FEATURE } from '../constants/featureConstants';

import type { Cluster } from '../../types/clusters_mgmt.v1';
import {
  SelfResourceReview,
  SelfAccessReview,
  SelfResourceReviewRequest,
} from '../../types/authorizations.v1';
import type {
  Subscription,
  SubscriptionList,
  SubscriptionCreateRequest,
  SubscriptionPatchRequest,
} from '../../types/accounts_mgmt.v1';
import type {
  AugmentedCluster,
  AugmentedClusterResponse,
  ClusterWithPermissions,
} from '../../types/types';
import type { AppThunk, AppThunkDispatch } from '../types';

const invalidateClusters = () => action(INVALIDATE_ACTION(clustersConstants.GET_CLUSTERS));

const createClusterAndUpgradeSchedule = async (
  cluster: Cluster,
  upgradeSchedule: boolean,
  dispatch: AppThunkDispatch,
) => {
  const clusterResponse = await clusterService.postNewCluster(cluster);
  if (upgradeSchedule) {
    const clusterID = clusterResponse.data.id;
    dispatch(postSchedule(clusterID, upgradeSchedule));
  }
  dispatch(invalidateClusters());
  return clusterResponse;
};

const createClusterAction = (clusterResponse: Promise<AxiosResponse<Cluster, any>>) =>
  action(clustersConstants.CREATE_CLUSTER, clusterResponse);

const createCluster =
  (params: Cluster, upgradeSchedule: boolean): AppThunk =>
  (dispatch) =>
    dispatch(
      createClusterAction(createClusterAndUpgradeSchedule(params, upgradeSchedule, dispatch)),
    );

const registerClusterAndUpdateSubscription = async (
  registrationRequest: SubscriptionCreateRequest,
  subscriptionRequest: SubscriptionPatchRequest,
  dispatch: AppThunkDispatch,
) => {
  const registerClusterResponse = await accountsService.registerDisconnected(registrationRequest);

  if (
    subscriptionRequest &&
    registerClusterResponse.status === 201 &&
    registerClusterResponse.data.id
  ) {
    dispatch(editSubscriptionSettings(registerClusterResponse.data.id, subscriptionRequest));
  }
  dispatch(invalidateClusters());
  return registerClusterResponse;
};

const registerDisconnectedCluster =
  (
    registrationRequest: SubscriptionCreateRequest,
    subscriptionRequest: SubscriptionPatchRequest,
  ): AppThunk =>
  (dispatch) =>
    dispatch(
      // FIXME how can the payload be a subscription when creating a cluster?
      action(
        clustersConstants.CREATE_CLUSTER,
        registerClusterAndUpdateSubscription(registrationRequest, subscriptionRequest, dispatch),
      ),
    );

const clearClusterResponse = () => action(clustersConstants.CLEAR_DISPLAY_NAME_RESPONSE);

const editCluster = (id: string, cluster: Cluster) =>
  action(clustersConstants.EDIT_CLUSTER, clusterService.editCluster(id, cluster));

// TODO create a new action and separate reducer eg. EDIT_SUBSCRIPTION_DISPLAY_NAME
const editClusterDisplayName = (subscriptionID: string, displayName: string) =>
  action(
    clustersConstants.EDIT_CLUSTER,
    accountsService.editSubscription(subscriptionID, { display_name: displayName }),
  );

/** Build a notification
 * Meta object with notifications. Notifications middleware uses it to get prepared to response to:
 * - <type>_PENDING (not used) - notification is sent right after the request was created
 * - <type>_FULFILLED - once promise is resolved
 * - <type>_PENDING (not used) - once promise is rejected
 *
 * @param {string} name - name of a cluster
 * @param {boolean} archived - action to display notification for (archive/unarchive)
 * @returns {object} - notification object
 *
 * @see https://github.com/RedHatInsights/frontend-components/blob/master/packages/notifications/doc/notifications.md
 */
const buildArchiveNotificationsMeta = (name: string, archived: boolean) => ({
  notifications: {
    fulfilled: {
      variant: 'success',
      title: `Cluster ${name} has been ${archived ? 'archived' : 'unarchived'}`,
      dismissDelay: 8000,
      dismissable: false,
    },
  },
});

const archiveCluster = (id: string, name: string) =>
  action(
    clustersConstants.ARCHIVE_CLUSTER,
    clusterService.archiveCluster(id),
    buildArchiveNotificationsMeta(name, true),
  );

const clearClusterArchiveResponse = () => action(clustersConstants.CLEAR_CLUSTER_ARCHIVE_RESPONSE);

const upgradeTrialCluster = (id: string, params: Cluster) =>
  action(clustersConstants.UPGRADE_TRIAL_CLUSTER, clusterService.upgradeTrialCluster(id, params));

const clearUpgradeTrialClusterResponse = () =>
  action(clustersConstants.CLEAR_UPGRADE_TRIAL_CLUSTER_RESPONSE);

const hibernateCluster = (id: string) =>
  action(clustersConstants.HIBERNATE_CLUSTER, clusterService.hibernateCluster(id));

const clearHibernateClusterResponse = () =>
  action(clustersConstants.CLEAR_CLUSTER_HIBERNATE_RESPONSE);

const resumeCluster = (id: string) =>
  action(clustersConstants.RESUME_CLUSTER, clusterService.resumeCluster(id));

const clearResumeClusterResponse = () => action(clustersConstants.CLEAR_RESUME_CLUSTER_RESPONSE);

const unarchiveCluster = (id: string, name: string) =>
  action(
    clustersConstants.UNARCHIVE_CLUSTER,
    clusterService.unarchiveCluster(id),
    buildArchiveNotificationsMeta(name, false),
  );

const clearClusterUnarchiveResponse = () =>
  action(clustersConstants.CLEAR_CLUSTER_UNARCHIVE_RESPONSE);

const editClusterConsoleURL = (id: string, subscriptionID: string, consoleURL: string) =>
  action(
    clustersConstants.EDIT_CLUSTER,
    clusterService
      .editCluster(id, { console: { url: consoleURL } })
      .then(() => accountsService.editSubscription(subscriptionID, { console_url: consoleURL })),
  );

/**
 * Collect a list of object IDs and build a SQL-like query searching for these IDs.
 * For example, to collect subscription IDs from clusters, so we can query
 * for the subscription info.
 * @param {*} items A collection of items
 * @param {string} field The field containing the ID to collect for the search
 */
const buildSearchQuery = (items: { [field: string]: unknown }[], field: string): string => {
  const IDs = new Set();
  items.forEach((item) => {
    const objectID = item[field];
    if (objectID) {
      IDs.add(`'${objectID}'`);
    }
  });
  return `id in (${Array.from(IDs).join(',')})`;
};

// Builds an array in the order things were inserted into `subscriptionMap`.
const createResponseForFetchClusters = (
  subscriptionMap: Map<string, { cluster?: Cluster; subscription: Subscription }>,
  canEdit: {
    [clusterID: string]: boolean;
  },
  canDelete: {
    [clusterID: string]: boolean;
  },
) => {
  const result: ClusterWithPermissions[] = [];
  subscriptionMap.forEach((entry) => {
    let cluster: ClusterWithPermissions;
    if (
      entry.subscription.managed &&
      entry.subscription.status !== subscriptionStatuses.DEPROVISIONED &&
      !!entry?.cluster &&
      !isEmpty(entry?.cluster)
    ) {
      // managed cluster, with data from Clusters Service
      cluster = {
        ...normalizeCluster(entry.cluster),
        subscription: entry.subscription,
        // TODO <bug #> entry.subscription.metrics is an array but normalizeMetrics wants a single metric
        // @ts-ignore
        metrics: normalizeMetrics(entry.subscription.metrics),
      };
    } else {
      cluster = isAssistedInstallSubscription(entry.subscription)
        ? // TODO mismatched cluster types
          // update when subscriptionMap contains separation of cluster and aiCluster
          // remove cast to OCM.Cluster
          fakeAIClusterFromSubscription(entry.subscription, entry.cluster as OCM.Cluster)
        : fakeClusterFromSubscription(entry.subscription);
    }

    // mark this as a clusters service cluster with partial data (happens when CS is down)
    cluster.partialCS = cluster.managed && (!entry?.cluster || isEmpty(entry?.cluster));

    cluster.canEdit =
      !cluster.partialCS &&
      (canEdit['*'] || (!!cluster.id && !!canEdit[cluster.id])) &&
      entry.subscription.status !== subscriptionStatuses.DEPROVISIONED;
    cluster.canDelete =
      !cluster.partialCS && (canDelete['*'] || (!!cluster.id && !!canDelete[cluster.id!]));
    cluster.subscription = entry.subscription;
    result.push(cluster);
  });
  return result;
};

const fetchClustersAndPermissions = async (
  clusterRequestParams: Parameters<typeof accountsService.getSubscriptions>[0],
  aiMergeListsFeatureFlag: boolean | undefined,
) => {
  let subscriptions: AxiosResponse<SubscriptionList, any>;
  let canEdit: {
    [clusterID: string]: boolean;
  };
  let canDelete: {
    [clusterID: string]: boolean;
  };

  const promises = [
    accountsService.getSubscriptions(clusterRequestParams).then((response) => {
      subscriptions = mapListResponse(response, normalizeSubscription);
    }),
    authorizationsService
      .selfResourceReview({
        action: SelfResourceReviewRequest.action.DELETE,
        resource_type: SelfResourceReview.resource_type.CLUSTER,
      })
      .then((response) => {
        canDelete = buildPermissionDict(response);
      }),
    authorizationsService
      .selfResourceReview({
        action: SelfResourceReviewRequest.action.UPDATE,
        resource_type: SelfResourceReview.resource_type.CLUSTER,
      })
      .then((response) => {
        canEdit = buildPermissionDict(response);
      }),
  ];

  const handler = () => {
    const items = subscriptions?.data?.items?.filter(
      (item) => aiMergeListsFeatureFlag || !isAssistedInstallSubscription(item),
    );

    if (!items) {
      return {
        data: {
          items: [] as ClusterWithPermissions[],
          page: 0,
          total: 0,
          queryParams: { ...clusterRequestParams },
        },
      };
    }

    // map subscription ID to subscription info
    // Note: Map keeps order of insertions.
    // Will display them in order returned by getSubscriptions().
    // TODO Should subscriptMap contain `cluster` and `aiCluster` properties
    const subscriptionMap = new Map<string, { cluster?: Cluster; subscription: Subscription }>();
    items.forEach((item) => {
      if (item.cluster_id) {
        subscriptionMap.set(item.cluster_id, {
          subscription: item,
        });
      }
    });

    const enrichForClusterService = async () => {
      // clusters-service only needed for managed clusters.
      const managedSubsriptions = items.filter(
        (s) => s.managed && s.status !== subscriptionStatuses.DEPROVISIONED,
      );
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
      try {
        return await clusterService.getClusters(clustersQuery).then((response) => {
          const clusters = response?.data?.items;
          clusters?.forEach((cluster) => {
            if (cluster.id) {
              const entry = subscriptionMap.get(cluster.id);
              if (entry !== undefined) {
                // store cluster into subscription map
                entry.cluster = cluster;
                subscriptionMap.set(cluster.id, entry);
              }
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
      } catch (e) {
        return {
          // When clusters service is down, return AMS data only
          data: {
            items: createResponseForFetchClusters(subscriptionMap, canEdit, canDelete),
            page: subscriptions.data.page,
            total: subscriptions.data.total || 0,
            queryParams: { ...clusterRequestParams },
            meta: {
              clustersServiceError: e as AxiosError,
            },
          },
        };
      }
    };

    const subscriptionIds: string[] = [];
    if (aiMergeListsFeatureFlag) {
      subscriptionMap.forEach(({ subscription }) => {
        if (isAssistedInstallSubscription(subscription) && subscription.id) {
          subscriptionIds.push(subscription.id);
        }
      });
    }

    // Performing a batch request to obtain the AI clusters data.
    const aiClustersRequest =
      subscriptionIds.length === 0
        ? Promise.resolve({ data: [] })
        : assistedService.getAIClustersBySubscription(subscriptionIds);
    return aiClustersRequest.then((res) => {
      const aiClusters = res.data || [];
      aiClusters.forEach((aiCluster) => {
        const clusterId = aiCluster.id;
        const entry = subscriptionMap.get(clusterId);
        if (entry) {
          // TODO different cluster types?
          // Possibly assign to entry.aiCluster to keep separate types
          // @ts-ignore
          entry.cluster = aiCluster;
          subscriptionMap.set(clusterId, entry);
        }
      });
      return enrichForClusterService();
    });
  };

  await Promise.all(promises);
  return handler();
};

const fetchClustersAction = (
  params: Parameters<typeof fetchClustersAndPermissions>[0],
  feature: boolean | undefined,
) => action(clustersConstants.GET_CLUSTERS, fetchClustersAndPermissions(params, feature));

const fetchClusters =
  (params: Parameters<typeof fetchClustersAndPermissions>[0]): AppThunk =>
  (dispatch, getState) =>
    dispatch(
      fetchClustersAction(params, getState().features[ASSISTED_INSTALLER_MERGE_LISTS_FEATURE]),
    );

const fetchSingleClusterAndPermissions = async (
  subscriptionID: string,
): Promise<AugmentedClusterResponse> => {
  let canEdit = false;
  let canEditOCMRoles = false;
  let canViewOCMRoles = false;

  const subscription = await accountsService.getSubscription(subscriptionID);
  subscription.data = normalizeSubscription(subscription.data);
  const isAROCluster = subscription?.data?.plan?.type === knownProducts.ARO;

  if (subscription.data.status !== subscriptionStatuses.DEPROVISIONED) {
    await authorizationsService
      .selfAccessReview({
        action: SelfAccessReview.action.UPDATE,
        resource_type: SelfAccessReview.resource_type.SUBSCRIPTION,
        subscription_id: subscriptionID,
      })
      .then((response) => {
        canEdit = response.data.allowed;
      });
    await authorizationsService
      .selfAccessReview({
        action: SelfAccessReview.action.CREATE,
        resource_type: SelfAccessReview.resource_type.SUBSCRIPTION_ROLE_BINDING,
        subscription_id: subscriptionID,
      })
      .then((response) => {
        canEditOCMRoles = response.data.allowed;
      });
    await authorizationsService
      .selfAccessReview({
        action: SelfAccessReview.action.GET,
        resource_type: SelfAccessReview.resource_type.SUBSCRIPTION_ROLE_BINDING,
        subscription_id: subscriptionID,
      })
      .then((response) => {
        canViewOCMRoles = response.data.allowed;
      });
  }

  if (
    (subscription.data.managed || isAROCluster) &&
    subscription.data.status !== subscriptionStatuses.DEPROVISIONED
  ) {
    // TODO cluster_id is optional in the schema, remove cast
    const clusterResponse = await clusterService.getClusterDetails(
      subscription.data.cluster_id as string,
    );

    const cluster: AugmentedClusterResponse = {
      data: {
        ...normalizeCluster(clusterResponse.data),
        subscription: subscription.data,
        // take metrics from AMS (even for OSD)
        metrics: normalizeMetrics(subscription.data.metrics?.[0]),
      },
    };

    const upgradeGates = await clusterService.getClusterGateAgreements(
      subscription.data.cluster_id as string,
    );

    cluster.data.upgradeGates = upgradeGates.data?.items || [];

    const canDeleteAccessReviewResponse = await authorizationsService.selfAccessReview({
      action: SelfAccessReview.action.DELETE,
      resource_type: SelfAccessReview.resource_type.CLUSTER,
      cluster_id: subscription.data.cluster_id,
    });

    const limitedSupportReasons = await clusterService.getLimitedSupportReasons(
      // TODO cluster_id is optional in the schema, remove cast
      subscription.data.cluster_id as string,
    );
    cluster.data.limitedSupportReasons = limitedSupportReasons.data?.items || [];

    cluster.data.canEdit = canEdit;
    cluster.data.canEditOCMRoles = canEditOCMRoles;
    cluster.data.canViewOCMRoles = canViewOCMRoles;
    cluster.data.canDelete = !!canDeleteAccessReviewResponse?.data?.allowed;

    return cluster;
  }

  let cluster: AugmentedCluster;
  if (isAssistedInstallSubscription(subscription.data) && subscription.data.cluster_id) {
    try {
      const aiCluster = await assistedService.getAICluster(subscription.data.cluster_id);
      cluster = fakeAIClusterFromSubscription(subscription.data, aiCluster?.data || null);
      cluster.aiCluster = aiCluster.data;
    } catch (e) {
      if ((e as AxiosError)?.response?.status === 404) {
        // The cluster is garbage collected or the user does not have privileges
        // eslint-disable-next-line no-console
        console.info(
          'Failed to query assisted-installer cluster id: ',
          subscription.data.cluster_id,
        );
        cluster = fakeClusterFromSubscription(subscription.data);
      } else {
        throw e;
      }
    }
    try {
      const { data: featureSupportLevels } = await assistedService.getAIFeatureSupportLevels();
      cluster.aiSupportLevels = featureSupportLevels;
    } catch (e) {
      Sentry.captureException(
        new Error(
          `Failed to query feature support levels: ${JSON.stringify(
            (e as AxiosError).response?.data,
          )}`,
        ),
      );
    }
  } else {
    cluster = fakeClusterFromSubscription(subscription.data);
  }

  cluster.canEdit = canEdit;
  cluster.canEditOCMRoles = canEditOCMRoles;
  cluster.canViewOCMRoles = canViewOCMRoles;
  cluster.canDelete = false; // OCP clusters can't be deleted
  cluster.subscription = subscription.data;
  return {
    data: cluster,
  };
};

const fetchClusterDetails = (subscriptionID: string) =>
  action(clustersConstants.GET_CLUSTER_DETAILS, fetchSingleClusterAndPermissions(subscriptionID));

const setClusterDetails = (cluster: AugmentedCluster, mergeDetails = false) =>
  action(clustersConstants.SET_CLUSTER_DETAILS, { cluster, mergeDetails });

const clearClusterDetails = () => action(clustersConstants.CLEAR_CLUSTER_DETAILS);

const resetCreatedClusterResponse = () => action(clustersConstants.RESET_CREATED_CLUSTER_RESPONSE);

const getClusterStatus = (clusterID: string) =>
  action(clustersConstants.GET_CLUSTER_STATUS, clusterService.getClusterStatus(clusterID));

const getInstallableVersions = (isRosa: boolean) =>
  action(clustersConstants.GET_CLUSTER_VERSIONS, clusterService.getInstallableVersions(isRosa));

type ClusterAction = ActionType<
  | typeof fetchClusterDetails
  | typeof setClusterDetails
  | typeof invalidateClusters
  | typeof createClusterAction
  | typeof clearClusterResponse
  | typeof editCluster
  | typeof editClusterDisplayName
  | typeof archiveCluster
  | typeof clearClusterArchiveResponse
  | typeof upgradeTrialCluster
  | typeof clearUpgradeTrialClusterResponse
  | typeof hibernateCluster
  | typeof clearHibernateClusterResponse
  | typeof resumeCluster
  | typeof clearResumeClusterResponse
  | typeof unarchiveCluster
  | typeof clearClusterUnarchiveResponse
  | typeof editClusterConsoleURL
  | typeof fetchClustersAction
  | typeof fetchClusterDetails
  | typeof clearClusterDetails
  | typeof resetCreatedClusterResponse
  | typeof getClusterStatus
  | typeof getInstallableVersions
>;

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
  getInstallableVersions,
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
  ClusterAction,
};
