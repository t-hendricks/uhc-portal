import { useMutation } from '@tanstack/react-query';

import { sendNetworkConfigRequests } from '~/components/clusters/ClusterDetailsMultiRegion/components/Networking/NetworkingActions';
import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

export const useEditClusterIngressMutation = (clusterID?: string, region?: string) => {
  const { isPending, isSuccess, isError, error, mutate } = useMutation({
    mutationKey: ['editClusterIngress'],
    mutationFn: async (data: any) => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = sendNetworkConfigRequests(
          data.formData,
          data.currentData,
          clusterID,
          clusterService,
        );
        return response;
      }
      const response = sendNetworkConfigRequests(
        data.formData,
        data.currentData,
        clusterID,
        clusterService,
      );
      return response;
    },
  });

  if (isError) {
    const formattedError = formatErrorData(isPending, isError, error);
    return {
      isPending,
      isSuccess,
      isError,
      error: formattedError.error,
      mutate,
    };
  }

  return {
    isPending,
    isSuccess,
    isError,
    error,
    mutate,
  };
};
