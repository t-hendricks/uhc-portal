import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

import { queryConstants } from '../queriesConstants';

export const refetchGetUserOidcConfigurations = () => {
  queryClient.invalidateQueries({
    queryKey: [queryConstants.FETCH_GET_USER_OIDC_CONFIGURATIONS],
    exact: true,
  });
};

export const useFetchGetUserOidcConfigurations = (
  awsAccountID: string,
  region?: string | undefined,
  isMultiRegionEnabled?: boolean | undefined,
) => {
  const { data, error, isError, isSuccess, isFetching } = useQuery({
    queryKey: [queryConstants.FETCH_GET_USER_OIDC_CONFIGURATIONS],
    queryFn: async () => {
      if (region && isMultiRegionEnabled) {
        const service = getClusterServiceForRegion(region);
        const response = await service.getOidcConfigurations(awsAccountID);
        return response;
      }
      const response = await clusterService.getOidcConfigurations(awsAccountID);
      return response;
    },
    retry: false,
  });
  return {
    data,
    error,
    isError,
    isSuccess,
    isFetching,
  };
};
