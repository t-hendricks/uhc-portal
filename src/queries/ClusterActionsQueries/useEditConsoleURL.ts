import { useMutation } from '@tanstack/react-query';

import { getClusterServiceForRegion } from '~/services/clusterService';

import { useEditSubscription } from '../common/useEditSubscription';

export const useEditConsoleURL = () => {
  const {
    mutate: mutateSubscription,
    isSuccess: isSubscriptionSuccess,
    error: subscriptionError,
    isError: isSubscriptionError,
    isPending: isSubscriptionPending,
    reset: subscriptionReset,
  } = useEditSubscription();
  const { isSuccess, error, isError, isPending, mutate, reset } = useMutation({
    mutationKey: ['accountService', 'clusterService', 'edit_cluster_url'],
    mutationFn: ({
      subscriptionID,
      clusterID,
      consoleUrl,
      region,
    }: {
      subscriptionID: string;
      clusterID: string;
      consoleUrl: string;
      region?: string;
    }) => {
      const clusterService = getClusterServiceForRegion(region);

      let sanitizedURL = consoleUrl;
      if (consoleUrl.endsWith('/')) {
        sanitizedURL = consoleUrl.substring(0, consoleUrl.length - 1);
      }

      return clusterService
        .editCluster(clusterID, { console: { url: sanitizedURL } })
        .then(() => mutateSubscription({ subscriptionID, data: { console_url: sanitizedURL } }));
    },
  });
  return {
    isSuccess: isSuccess && isSubscriptionSuccess,
    error: error || subscriptionError,
    isError: isError || isSubscriptionError,
    isPending: isPending || isSubscriptionPending,
    mutate,
    reset: () => {
      reset();
      subscriptionReset();
    },
  };
};
