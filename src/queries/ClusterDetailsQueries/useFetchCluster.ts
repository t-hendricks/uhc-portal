import { useQuery } from '@tanstack/react-query';

import { subscriptionStatuses } from '~/common/subscriptionTypes';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';
import { Subscription } from '~/types/accounts_mgmt.v1';

import { queryConstants } from '../queriesConstants';

/**
 * Query to fetch cluster details based on subscription
 * @param clusterID clusterID from subscription
 * @param subscription result of subscription query
 * @param isAROCluster boolean to check for enabled
 * @param mainQueryKey query key for invalidation
 * @returns query states. Loading, error and cluster
 */
export const useFetchCluster = (
  clusterID: string,
  subscription: Subscription | undefined,
  isAROCluster: boolean | undefined,
  mainQueryKey: string,
) => {
  const { isLoading, data, isError, error, isFetching } = useQuery({
    queryKey: [mainQueryKey, 'clusterService', clusterID, subscription],
    queryFn: async () => {
      if (subscription?.xcm_id) {
        const clusterService = getClusterServiceForRegion(subscription?.xcm_id);
        const response = await clusterService.getClusterDetails(clusterID);
        return response;
      }
      const response = await clusterService.getClusterDetails(clusterID);
      return response;
    },
    retry: false,
    staleTime: queryConstants.STALE_TIME,
    enabled:
      !!subscription &&
      subscription.status !== subscriptionStatuses.DEPROVISIONED &&
      (subscription.managed || isAROCluster),
  });
  return {
    isLoading,
    data,
    isError,
    error,
    isFetching,
  };
};
