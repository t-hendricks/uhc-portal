import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

export const useAddAddOn = (clusterID: string, clusterAddOn: any, region?: string) => {
  const { data, mutate, mutateAsync, isPending, isError, error } = useMutation({
    mutationKey: ['addAddOn'],
    mutationFn: async () => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = clusterService.addClusterAddOn(clusterID, clusterAddOn);
        return response;
      }

      const response = clusterService.addClusterAddOn(clusterID, clusterAddOn);
      return response;
    },
  });

  if (isError) {
    const formattedError = formatErrorData(isPending, isError, error);

    return {
      isPending,
      isError,
      mutate,
      mutateAsync,
      error: formattedError.error,
    };
  }

  return {
    isPending,
    isError,
    error,
    mutate,
    mutateAsync,
    data,
  };
};
