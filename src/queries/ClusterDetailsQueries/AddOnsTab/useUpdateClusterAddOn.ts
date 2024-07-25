import { useMutation } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';
import { AddOnInstallation } from '~/types/clusters_mgmt.v1';

export const useUpdateClusterAddOn = (region?: string) => {
  const { data, mutate, mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationKey: ['updateClusterAddOn'],
    mutationFn: async ({
      clusterID,
      addOnID,
      addOnData,
    }: {
      clusterID: string;
      addOnID: string;
      addOnData: AddOnInstallation;
    }) => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = clusterService.updateClusterAddOn(clusterID, addOnID, addOnData);
        return response;
      }
      const response = clusterService.updateClusterAddOn(clusterID, addOnID, addOnData);
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
      error: formattedError.error,
      isPending,
      isError,
      mutate,
      mutateAsync,
      isSuccess,
    };
  }

  return {
    data,
    error,
    isError,
    isPending,
    mutate,
    mutateAsync,
    isSuccess,
  };
};
