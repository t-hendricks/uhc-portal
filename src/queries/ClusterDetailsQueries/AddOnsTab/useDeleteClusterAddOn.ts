import { useMutation } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

export const useDeleteClusterAddOn = (region?: string) => {
  const { data, mutate, mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationKey: ['deleteClusterAddOn'],
    mutationFn: async ({ clusterID, addOnID }: { clusterID: string; addOnID: string }) => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = clusterService.deleteClusterAddOn(clusterID, addOnID);
        return response;
      }

      const response = clusterService.deleteClusterAddOn(clusterID, addOnID);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clusterAddOns'] });
      queryClient.invalidateQueries({ queryKey: ['addOns'] });
    },
  });

  if (isError) {
    const formattedError = formatErrorData(isPending, isError, error);
    return {
      data,
      mutate,
      mutateAsync,
      isPending,
      isError,
      error: formattedError.error,
      isSuccess,
    };
  }

  return {
    data,
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
    isSuccess,
  };
};
