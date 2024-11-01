import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { formatErrorData } from '~/queries/helpers';
import { queryConstants } from '~/queries/queriesConstants';
import accessRequestService from '~/services/accessTransparency/accessRequestService';
import { ViewOptions } from '~/types/types';

export const refetchAccessRequests = () => {
  queryClient.invalidateQueries({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'fetchAccessRequests'],
  });
};

export const useFetchAccessRequests = (
  subscriptionId: string,
  params: ViewOptions,
  isAccessProtectionLoading?: boolean,
  accessProtection?: { enabled: boolean },
) => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: [
      queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY,
      'fetchAccessRequests',
      params,
      isAccessProtectionLoading,
      accessProtection,
    ],
    queryFn: async () => {
      const response = await accessRequestService.getAccessRequests({
        page: params.currentPage,
        size: params.pageSize,
        search: `subscription_id='${subscriptionId}'`,
        orderBy: params.sorting.sortField
          ? `${params.sorting.sortField} ${params.sorting.isAscending ? 'asc' : 'desc'}`
          : undefined,
      });
      return response;
    },
    enabled: !isAccessProtectionLoading && accessProtection?.enabled,
  });

  return {
    data: data?.data,
    isLoading,
    isError,
    error: isError ? formatErrorData(isLoading, isError, error) : error,
    isSuccess,
  };
};
