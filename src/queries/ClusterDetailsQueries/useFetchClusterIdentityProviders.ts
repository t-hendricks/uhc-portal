import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

import { queryConstants } from '../queriesConstants';

/**
 * Query for invalidating cluster IDPs (refetch)
 */
export const invalidateClusterIdentityProviders = (clusterID?: string) => {
  queryClient.invalidateQueries({
    queryKey: ['clusterIdentityProviders', 'clusterService', clusterID],
  });
};

/**
 * Query for fetching cluster IDP based on the region
 * @param clusterID cluster ID to pass into api call
 * @param region region for api endpoint
 * @returns cluster IDPs list
 */
export const useFetchClusterIdentityProviders = (clusterID: string, region?: string) => {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ['clusterIdentityProviders', 'clusterService', clusterID, region],
    queryFn: async () => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = await clusterService.getIdentityProviders(clusterID);
        return response;
      }
      const response = await clusterService.getIdentityProviders(clusterID);

      return response;
    },
    staleTime: queryConstants.STALE_TIME,
    enabled: !!clusterID,
  });

  return {
    isLoading,
    clusterIdentityProviders: data,
    isError,
    error,
  };
};
