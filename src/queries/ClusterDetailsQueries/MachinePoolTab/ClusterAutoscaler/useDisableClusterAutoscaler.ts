import { useMutation } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

export const useDisableClusterAutoscaler = (clusterID: string, region?: string) => {
  const { data, isPending, isError, error, mutate, mutateAsync, isSuccess } = useMutation({
    mutationKey: ['clusterAutoscaler', 'disableClusterAutoscaler', clusterID],
    mutationFn: async () => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = clusterService.disableClusterAutoscaler(clusterID);
        return response;
      }

      const response = clusterService.disableClusterAutoscaler(clusterID);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clusterAutoscaler'] });
    },
  });
  const errorData = formatErrorData(isPending, isError, error);

  return {
    data,
    isPending,
    isError,
    error: errorData,
    mutate,
    mutateAsync,
    isSuccess,
  };
};
