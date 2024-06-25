/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import { useCallback } from 'react';

import { useQueries, useQuery, UseQueryResult } from '@tanstack/react-query';

import { subscriptionStatuses } from '~/common/subscriptionTypes';
import { authorizationsService } from '~/services';
import { SelfAccessReview } from '~/types/accounts_mgmt.v1';

import { queryConstants } from '../queriesConstants';
import { SubscriptionResponseType } from '../types';

const actions = [
  SelfAccessReview.action.CREATE,
  SelfAccessReview.action.UPDATE,
  SelfAccessReview.action.GET,
  SelfAccessReview.action.LIST,
  SelfAccessReview.action.DELETE,
];
/**
 * Function assembling permissions
 * @param obj action receiver
 * @param action crud action
 * @returns
 */
const buildPermissionsByActionObj = (obj: any, action: SelfAccessReview.action) => {
  // eslint-disable-next-line no-param-reassign
  obj[action] = false;
  return obj;
};

/**
 * Function fetching permissions
 * @param action action of the resource
 * @param resourceType which resource makes api call
 * @param subscriptionID
 * @returns boolean if action is permitted
 */
export const fetchPermissions = async (
  action: SelfAccessReview.action,
  resourceType: SelfAccessReview.resource_type,
  subscriptionID: string,
) => {
  const response = await authorizationsService.selfAccessReview({
    action,
    resource_type: resourceType,
    subscription_id: subscriptionID,
  });
  return response.data.allowed;
};

/**
 * Query responsible for fetching actions and permissions
 * @param subscriptionID subscription ID to pass into api call
 * @param mainQueryKey used for invalidation of the query (refetch)
 * @param subscriptionStatus status of the subscription for query enablement
 * @returns actions and permissions data
 */
export const useFetchActionsPermissions = (
  subscriptionID: string,
  mainQueryKey: string,
  subscriptionStatus?: string,
) => {
  const { isLoading, data, isError, error, isFetching } = useQueries({
    queries: [
      {
        queryKey: [
          mainQueryKey,
          'authorizationService',
          'selfResourceReview',
          SelfAccessReview.action.UPDATE,
          SelfAccessReview.resource_type.SUBSCRIPTION,
        ],
        queryFn: async () => {
          const canEdit = fetchPermissions(
            SelfAccessReview.action.UPDATE,
            SelfAccessReview.resource_type.SUBSCRIPTION,
            subscriptionID,
          );
          return canEdit;
        },
        staleTime: queryConstants.STALE_TIME,
        enabled: subscriptionStatus !== subscriptionStatuses.DEPROVISIONED,
      },
      {
        queryKey: [
          mainQueryKey,
          'authorizationService',
          'selfResourceReview',
          SelfAccessReview.action.UPDATE,
          SelfAccessReview.resource_type.CLUSTER_AUTOSCALER,
          subscriptionID,
        ],
        queryFn: async () => {
          const canEditClusterAutoscaler = fetchPermissions(
            SelfAccessReview.action.UPDATE,
            SelfAccessReview.resource_type.CLUSTER_AUTOSCALER,
            subscriptionID,
          );
          return canEditClusterAutoscaler;
        },
        staleTime: queryConstants.STALE_TIME,
        enabled: subscriptionStatus !== subscriptionStatuses.DEPROVISIONED,
      },
      {
        queryKey: [
          mainQueryKey,
          'authorizationService',
          'selfResourceReview',
          SelfAccessReview.action.CREATE,
          SelfAccessReview.resource_type.SUBSCRIPTION_ROLE_BINDING,
          subscriptionID,
        ],
        queryFn: async () => {
          const canEditOCMRoles = fetchPermissions(
            SelfAccessReview.action.CREATE,
            SelfAccessReview.resource_type.SUBSCRIPTION_ROLE_BINDING,
            subscriptionID,
          );
          return canEditOCMRoles;
        },
        staleTime: queryConstants.STALE_TIME,
        enabled: subscriptionStatus !== subscriptionStatuses.DEPROVISIONED,
      },
      {
        queryKey: [
          mainQueryKey,
          'authorizationService',
          'selfResourceReview',
          SelfAccessReview.action.GET,
          SelfAccessReview.resource_type.SUBSCRIPTION_ROLE_BINDING,
          subscriptionID,
        ],
        queryFn: async () => {
          const canViewOCMRoles = fetchPermissions(
            SelfAccessReview.action.GET,
            SelfAccessReview.resource_type.SUBSCRIPTION_ROLE_BINDING,
            subscriptionID,
          );
          return canViewOCMRoles;
        },
        staleTime: queryConstants.STALE_TIME,
        enabled: subscriptionStatus !== subscriptionStatuses.DEPROVISIONED,
      },
      {
        queryKey: [
          mainQueryKey,
          'authorizationService',
          'selfResourceReview',
          SelfAccessReview.action.GET,
          SelfAccessReview.resource_type.SUBSCRIPTION_ROLE_BINDING,
          subscriptionID,
        ],
        queryFn: async () => {
          const canUpdateClusterResource = fetchPermissions(
            SelfAccessReview.action.UPDATE,
            SelfAccessReview.resource_type.CLUSTER,
            subscriptionID,
          );
          return canUpdateClusterResource;
        },
        staleTime: queryConstants.STALE_TIME,
        enabled: subscriptionStatus !== subscriptionStatuses.DEPROVISIONED,
      },
      {
        queryKey: [mainQueryKey, 'kubeletConfigPermissions', actions, subscriptionID],
        queryFn: async () => {
          const kubeletConfigActions: { [action: string]: boolean } = actions.reduce(
            buildPermissionsByActionObj,
            {} as Record<SelfAccessReview.action, boolean>,
          );
          for (const action of actions) {
            kubeletConfigActions[action] = await fetchPermissions(
              action,
              SelfAccessReview.resource_type.CLUSTER_KUBELET_CONFIG,
              subscriptionID,
            );
          }
          return kubeletConfigActions;
        },
        staleTime: queryConstants.STALE_TIME,
        enabled: !!subscriptionID && subscriptionStatus !== subscriptionStatuses.DEPROVISIONED,
      },
      {
        queryKey: [mainQueryKey, 'machinePoolPermissions', actions, subscriptionID],
        queryFn: async () => {
          const machinePoolsActions: { [action: string]: boolean } = actions.reduce(
            buildPermissionsByActionObj,
            {} as Record<SelfAccessReview.action, boolean>,
          );
          for (const action of actions) {
            machinePoolsActions[action] = await fetchPermissions(
              action,
              SelfAccessReview.resource_type.MACHINE_POOL,
              subscriptionID,
            );
          }
          return machinePoolsActions;
        },
        staleTime: queryConstants.STALE_TIME,
        enabled: !!subscriptionID && subscriptionStatus !== subscriptionStatuses.DEPROVISIONED,
      },
      {
        queryKey: [mainQueryKey, 'idpPermissions', actions, subscriptionID],
        queryFn: async () => {
          const idpActions: { [action: string]: boolean } = actions.reduce(
            buildPermissionsByActionObj,
            {} as Record<SelfAccessReview.action, boolean>,
          );
          for (const action of actions) {
            idpActions[action] = await fetchPermissions(
              action,
              SelfAccessReview.resource_type.IDP,
              subscriptionID,
            );
          }
          return idpActions;
        },
        staleTime: queryConstants.STALE_TIME,
        enabled: !!subscriptionID && subscriptionStatus !== subscriptionStatuses.DEPROVISIONED,
      },
    ],
    combine: useCallback((results: UseQueryResult[]) => {
      const [
        canEdit,
        canEditClusterAutoscaler,
        canEditOCMRoles,
        canViewOCMRoles,
        canUpdateClusterResource,
        kubeletConfigActions,
        machinePoolsActions,
        idpActions,
      ] = results;

      return {
        isLoading: results.some((result: UseQueryResult) => result.isLoading),
        isError: results.some((result: UseQueryResult) => result.isError),
        error: results.map((result: UseQueryResult) => result.error),
        isFetching: results.some((result: UseQueryResult) => result.isFetching),
        data: {
          canEdit,
          canEditClusterAutoscaler,
          canEditOCMRoles,
          canViewOCMRoles,
          canUpdateClusterResource,
          kubeletConfigActions,
          machinePoolsActions,
          idpActions,
        },
      };
    }, []),
  });

  return {
    isActionQueriesLoading: isLoading,
    isError,
    isFetching,
    error,
    canEdit: !!data?.canEdit.data,
    canEditClusterAutoscaler: !!data?.canEditClusterAutoscaler.data,
    canEditOCMRoles: !!data?.canEditOCMRoles.data,
    canViewOCMRoles: !!data?.canViewOCMRoles.data,
    canUpdateClusterResource: !!data?.canUpdateClusterResource.data,
    kubeletConfigActions: data?.kubeletConfigActions.data as { [action: string]: boolean },
    machinePoolsActions: data?.machinePoolsActions.data as { [action: string]: boolean },
    idpActions: data?.idpActions.data as { [action: string]: boolean },
  };
};

export const useCanDeleteAccessReview = (
  clusterID: string,
  subscription: SubscriptionResponseType | undefined,
  mainQueryKey: string,
) => {
  const { isLoading, data, isError, error, isFetching } = useQuery({
    queryKey: [mainQueryKey, 'authorizationService', 'canDeleteAccessReview', actions, clusterID],
    queryFn: async () => {
      const response = await authorizationsService.selfAccessReview({
        action: SelfAccessReview.action.DELETE,
        resource_type: SelfAccessReview.resource_type.CLUSTER,
        cluster_id: clusterID,
      });
      return response;
    },
    staleTime: queryConstants.STALE_TIME,
    enabled:
      !!subscription &&
      subscription.subscription.status !== subscriptionStatuses.DEPROVISIONED &&
      (subscription.subscription.managed || subscription.isAROCluster),
  });
  return {
    isLoading,
    data,
    isError,
    error,
    isFetching,
  };
};
