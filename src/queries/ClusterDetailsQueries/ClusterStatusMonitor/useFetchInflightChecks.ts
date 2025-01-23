import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { formatErrorData } from '~/queries/helpers';
import { queryConstants } from '~/queries/queriesConstants';
import { clusterService } from '~/services';
import { getClusterServiceForRegion } from '~/services/clusterService';

export const useInvalidateFetchInflightChecks = async () => {
  await queryClient.invalidateQueries({
    queryKey: [queryConstants.FETCH_CLUSTER_STATUS_MONITOR_INFLIGHT_CHECKS],
  });
};

export const useInvalidateFetchRerunInflightChecks = async () => {
  await queryClient.invalidateQueries({ queryKey: ['fetchRerunInflightChecks'] });
};

export const useFetchInflightChecks = (
  clusterID: string,
  region?: string,
  refetchInterval?: boolean,
  queryKey: string = queryConstants.FETCH_CLUSTER_STATUS_MONITOR_INFLIGHT_CHECKS,
) => {
  const { isLoading, data } = useQuery({
    queryKey: [
      queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY,
      queryKey,
      'inflightChecks',
      'clusterService',
      clusterID,
    ],
    queryFn: async () => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = await clusterService.getInflightChecks(clusterID);
        return response;
      }
      const response = await clusterService.getInflightChecks(clusterID);
      return response;
    },
    retry: false,
    refetchInterval: refetchInterval ? 5000 : undefined,
    enabled: !!clusterID,
  });
  return {
    isLoading,
    checks: data?.data,
  };
};

const fetchRerunInflightChecks = async (subnetIds?: string[], region?: string) => {
  if (region) {
    const clusterService = getClusterServiceForRegion(region);
    const results = subnetIds?.map((subnetId: string) =>
      clusterService.getTriggeredInflightCheckState(subnetId),
    );
    // @ts-ignore  error due to using an older compiler
    const response = await Promise.allSettled(results);
    const items = response
      .filter((res: { status: string }) => res.status !== 'rejected')
      .map((item: any) => item?.value?.data);
    return {
      data: {
        items,
        page: 0,
        total: 0,
      },
    };
  }
  const results = subnetIds?.map((subnetId: string) =>
    clusterService.getTriggeredInflightCheckState(subnetId),
  );
  // @ts-ignore  error due to using an older compiler
  const response = await Promise.allSettled(results);

  const items = response
    .filter((res: { status: string }) => res.status !== 'rejected')
    .map((item: any) => item?.value?.data);
  return {
    data: {
      items,
      page: 0,
      total: 0,
    },
  };
};

export const useFetchRerunInflightChecks = (
  subnetIds?: string[],
  region?: string,
  refetchInterval?: boolean,
) => {
  const { isLoading, data } = useQuery({
    queryKey: [
      queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY,
      'fetchRerunInflightChecks',
      'clusterService',
      subnetIds,
    ],
    queryFn: () => fetchRerunInflightChecks(subnetIds, region),
    refetchInterval: refetchInterval ? 5000 : undefined,
    enabled: subnetIds && subnetIds.length > 0,
  });

  return {
    isLoading,
    data,
  };
};

export const useMutateRerunInflightChecks = (clusterID: string, region?: string) => {
  const { data, isPending, isError, error, isSuccess, mutate, mutateAsync, reset } = useMutation({
    mutationKey: ['rerunInflightChecks', 'clusterService', clusterID],
    mutationFn: async () => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = await clusterService.rerunInflightChecks(clusterID);
        return response;
      }
      const response = await clusterService.rerunInflightChecks(clusterID);
      return response;
    },
  });

  return {
    data,
    isPending,
    isError,
    error: formatErrorData(isPending, isError, error),
    isSuccess,
    mutate,
    mutateAsync,
    reset,
  };
};
