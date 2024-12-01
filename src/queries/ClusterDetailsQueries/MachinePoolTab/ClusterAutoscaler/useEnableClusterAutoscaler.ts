import { useMutation } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import {
  getClusterAutoScalingSubmitSettings,
  getDefaultClusterAutoScaling,
} from '~/components/clusters/common/clusterAutoScalingValues';
import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

export const useEnableClusterAutoscaler = (
  clusterID: string,
  maxNodesTotalDefault: number,
  region?: string,
) => {
  const { data, isPending, isSuccess, isError, error, mutate, mutateAsync } = useMutation({
    mutationKey: ['clusterAutoscaler', 'enableClusterAutoscaler', clusterID],
    mutationFn: async () => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = clusterService.enableClusterAutoscaler(
          clusterID,
          getClusterAutoScalingSubmitSettings(getDefaultClusterAutoScaling(maxNodesTotalDefault)),
        );
        return response;
      }

      const response = clusterService.enableClusterAutoscaler(
        clusterID,
        getClusterAutoScalingSubmitSettings(getDefaultClusterAutoScaling(maxNodesTotalDefault)),
      );
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
    isSuccess,
    isError,
    error: errorData,
    mutate,
    mutateAsync,
  };
};
