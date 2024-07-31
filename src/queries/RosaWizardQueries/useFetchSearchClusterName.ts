import { useQuery } from '@tanstack/react-query';

import { sqlString } from '~/common/queryHelpers';
import { queryClient } from '~/components/App/queryClient';
import { getClusterServiceForRegion } from '~/services/clusterService';

import { clusterService } from '../../services';
import { createResponseForSearchCluster } from '../helpers';
import { queryConstants } from '../queriesConstants';

export const refetchSearchClusterName = () => {
  queryClient.invalidateQueries({
    queryKey: [queryConstants.FETCH_SEARCH_CLUSTER_NAME],
    exact: true,
  });
};

export const useFetchSearchClusterName = (
  search: string,
  region?: string | undefined,
  isMultiRegionEnabled?: boolean,
) => {
  const { data, isError, error, isFetching } = useQuery({
    queryKey: [queryConstants.FETCH_SEARCH_CLUSTER_NAME],
    queryFn: async () => {
      if (region) {
        const service = getClusterServiceForRegion(region);
        const searchValue = `name = ${sqlString(search)}`;
        const response = await service.searchClusters(searchValue, 1);

        return createResponseForSearchCluster(response?.data?.items);
      }

      const searchValue = `name = ${sqlString(search)}`;
      const response = await clusterService.searchClusters(searchValue, 1);
      return createResponseForSearchCluster(response?.data?.items);
    },
    retry: false,
    enabled: isMultiRegionEnabled,
  });

  return {
    data,
    isError,
    error,
    isFetching,
  };
};
