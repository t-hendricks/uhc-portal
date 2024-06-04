import { useCallback, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';

import type { KubeletConfig } from '~/types/clusters_mgmt.v1';

export function useGetKubeletConfig(
  getKubeletService: (clusterId: string) => Promise<AxiosResponse<KubeletConfig>>,
): {
  getKubeletConfig: (clusterID: string) => void;
  kubeletConfig?: KubeletConfig | null;
  isLoading: boolean;
  error?: unknown;
} {
  const [kubeletConfig, setKubeletConfig] = useState<KubeletConfig | null>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(false);

  const getKubeletConfig = useCallback(
    (clusterID: string): void => {
      setIsLoading(true);
      setError(undefined);
      setKubeletConfig(undefined);
      getKubeletService(clusterID)
        .then((response) => setKubeletConfig(response.data))
        .catch((err: AxiosError) => {
          if (err.response?.status === 404) {
            // A 404 response means there's no kubelet config yet for the provided clusterID
            setKubeletConfig(null);
          } else {
            setError(err);
          }
        })
        .finally(() => setIsLoading(false));
    },
    [getKubeletService],
  );

  return { getKubeletConfig, isLoading, kubeletConfig, error };
}
