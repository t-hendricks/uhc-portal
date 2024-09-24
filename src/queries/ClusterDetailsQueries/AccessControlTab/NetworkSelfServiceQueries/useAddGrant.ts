import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

export const useAddGrant = (clusterID: string, region?: string) => {
  const { data, isPending, isError, error, mutate, reset } = useMutation({
    mutationKey: ['addGrant'],
    mutationFn: async ({ roleId, arn }: { roleId: string; arn: string }) => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = clusterService.addGrant(clusterID, roleId, arn);
        return response;
      }

      const response = clusterService.addGrant(clusterID, roleId, arn);
      return response;
    },
  });

  if (isError) {
    const formattedError = formatErrorData(isPending, isError, error);

    return {
      data,
      isPending,
      isError,
      error: formattedError,
      mutate,
      reset,
    };
  }

  return {
    data,
    isPending,
    isError,
    error,
    mutate,
    reset,
  };
};
