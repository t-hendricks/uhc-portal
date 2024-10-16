import { useMutation } from '@tanstack/react-query';

import accountsService from '~/services/accountsService';
import { getClusterServiceForRegion } from '~/services/clusterService';

export const useEditConsoleURL = () => {
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
        .then(() =>
          accountsService.editSubscription(subscriptionID, { console_url: sanitizedURL }),
        );
    },
  });
  return { isSuccess, error, isError, isPending, mutate, reset };
};
