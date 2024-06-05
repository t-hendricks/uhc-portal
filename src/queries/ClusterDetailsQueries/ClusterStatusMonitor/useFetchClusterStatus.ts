import { useQuery } from '@tanstack/react-query';

import { queryConstants } from '~/queries/queriesConstants';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

export const useFetchClusterStatus = (clusterID: string, region?: string) => {
  const { isLoading, data, isError, error, refetch } = useQuery({
    queryKey: ['clusterStatus', 'clusterService', clusterID],
    queryFn: async () => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = await clusterService.getClusterStatus(clusterID);
        return response;
      }
      const response = await clusterService.getClusterStatus(clusterID);
      return response;
    },
    retry: false,
    staleTime: queryConstants.STALE_TIME,
    enabled: !!clusterID,
  });
  return {
    isLoading,
    status: data?.data,
    isError,
    error,
    refetch,
  };
};
