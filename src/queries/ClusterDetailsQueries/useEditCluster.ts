import { useMutation } from '@tanstack/react-query';

import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';
import { Cluster } from '~/types/clusters_mgmt.v1';

import { formatErrorData } from '../helpers';

export const useEditCluster = (clusterID: string, region?: string) => {
  const { data, isPending, isError, error, mutate, reset } = useMutation({
    mutationKey: ['editCluster'],
    mutationFn: async (formData: Cluster) => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = clusterService.editCluster(clusterID, formData);
        return response;
      }

      const response = clusterService.editCluster(clusterID, formData);
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
