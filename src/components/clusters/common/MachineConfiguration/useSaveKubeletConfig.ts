import { useCallback, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';

import type { KubeletConfig } from '~/types/clusters_mgmt.v1';

export function useSaveKubeletConfig(
  createKubeletService: (
    clusterId: string,
    config: KubeletConfig,
  ) => Promise<AxiosResponse<KubeletConfig>>,
  updateKubeletService: (
    clusterId: string,
    config: KubeletConfig,
  ) => Promise<AxiosResponse<KubeletConfig>>,
): {
  saveKubeletConfig: (clusterID: string, config: KubeletConfig, type: 'post' | 'patch') => void;
  kubeletConfig?: KubeletConfig;
  isSaving: boolean;
  error?: unknown;
} {
  const [kubeletConfig, setKubeletConfig] = useState<KubeletConfig>();
  const [error, setError] = useState<unknown>();
  const [isSaving, setIsSaving] = useState(false);

  const saveKubeletConfig = useCallback(
    (clusterID: string, config: KubeletConfig, type: 'post' | 'patch'): void => {
      setIsSaving(true);
      setError(undefined);
      setKubeletConfig(undefined);
      const saveService = type === 'post' ? createKubeletService : updateKubeletService;
      saveService(clusterID, config)
        .then((response) => setKubeletConfig(response.data))
        .catch((err: AxiosError) => {
          setError(err);
        })
        .finally(() => setIsSaving(false));
    },
    [createKubeletService, updateKubeletService],
  );

  return { saveKubeletConfig, isSaving, kubeletConfig, error };
}
