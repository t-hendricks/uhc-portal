import { useQuery } from '@tanstack/react-query';

import { subscriptionStatuses } from '~/common/subscriptionTypes';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

import { queryConstants } from '../queriesConstants';
import { SubscriptionResponseType } from '../types';

/**
 * Query for fetching inflight checks based on region
 * @param clusterID cluster ID to pass into api call
 * @param subscription Axios response from subscription (required this way for query enablement)
 * @param mainQueryKey used for refetch
 * @returns cluster IDPs list
 */
export const useFetchInflightChecks = (
  clusterID: string,
  subscription: SubscriptionResponseType | undefined,
  mainQueryKey: string,
) => {
  const { isLoading, data, isError, isFetching } = useQuery({
    queryKey: [mainQueryKey, 'inflightChecks', 'clusterService', clusterID, subscription],
    queryFn: async () => {
      if (subscription?.subscription.xcm_id) {
        const clusterService = getClusterServiceForRegion(subscription?.subscription.xcm_id);
        const response = await clusterService.getInflightChecks(clusterID);
        return response;
      }
      const response = await clusterService.getInflightChecks(clusterID);
      return response;
    },
    staleTime: queryConstants.STALE_TIME,
    enabled:
      !!subscription &&
      (subscription.isROSACluster || subscription.isOSDCluster) &&
      subscription.subscription.status !== subscriptionStatuses.DEPROVISIONED &&
      (subscription.subscription.managed || subscription.isAROCluster),
  });
  return {
    isLoading,
    data,
    isError,
    isFetching,
  };
};
