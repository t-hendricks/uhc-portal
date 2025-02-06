import { useQuery } from '@tanstack/react-query';

import { queryConstants } from '~/queries/queriesConstants';
import clusterService from '~/services/clusterService';

export const useFetchGCPWifConfig = (id?: string) => {
  const { data, status, isLoading, isFetching } = useQuery({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'wif-config', id],
    queryFn: async () => clusterService.getGCPWifConfig(id as string),
    enabled: !!id,
    refetchOnMount: false,
  });

  return {
    data: data?.data,
    status,
    isLoading,
    isFetching,
  };
};
