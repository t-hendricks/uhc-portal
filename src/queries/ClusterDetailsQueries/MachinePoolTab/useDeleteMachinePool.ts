import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import { getClusterService, getClusterServiceForRegion } from '~/services/clusterService';

export const useDeleteMachinePool = (
  clusterID: string,
  isHypershiftCluster: boolean,
  region?: string,
) => {
  const { data, isPending, isError, isSuccess, mutate, mutateAsync, error } = useMutation({
    mutationKey: ['deleteMachinePool', 'clusterService'],
    mutationFn: async (machinePoolID: string) => {
      const clusterService = region ? getClusterServiceForRegion(region) : getClusterService();
      const deleteMachinePoolFunction = isHypershiftCluster
        ? clusterService.deleteNodePool
        : clusterService.deleteMachinePool;

      const response = await deleteMachinePoolFunction(clusterID, machinePoolID);

      return response;
    },
  });
  if (isError) {
    const formattedError = formatErrorData(isPending, isError, error);
    return {
      data,
      isPending: false,
      isError,
      isSuccess: false,
      mutate,
      mutateAsync,
      error: formattedError,
    };
  }

  return {
    data,
    isPending,
    isError,
    isSuccess,
    mutate,
    mutateAsync,
    error,
  };
};
