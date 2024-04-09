import React, { useEffect } from 'react';
import { AxiosResponse } from 'axios';
import omit from 'lodash/omit';

import { MachineConfigurationEditor } from '~/components/clusters/common/MachineConfiguration/components/MachineConfigurationEditor';
import { MachineConfigurationLoadingError } from '~/components/clusters/common/MachineConfiguration/components/MachineConfigurationLoadingError';
import { MachineConfigurationModal } from '~/components/clusters/common/MachineConfiguration/components/MachineConfigurationModal';
import { useGetKubeletConfig } from '~/components/clusters/common/MachineConfiguration/useGetKubeletConfig';
import { useSaveKubeletConfig } from '~/components/clusters/common/MachineConfiguration/useSaveKubeletConfig';
import type { KubeletConfig } from '~/types/clusters_mgmt.v1';

export interface MachineConfigurationProps {
  /** ID of the cluster */
  clusterID: string;
  /** Function to retrieve the existing configuration */
  getMachineConfiguration: (clusterId: string) => Promise<AxiosResponse<KubeletConfig>>;
  /** Function to create a new configuration */
  createMachineConfiguration: (
    clusterId: string,
    config: KubeletConfig,
  ) => Promise<AxiosResponse<KubeletConfig>>;
  /** Function to update an existing configuration */
  updateMachineConfiguration: (
    clusterId: string,
    config: KubeletConfig,
  ) => Promise<AxiosResponse<KubeletConfig>>;
  /** Callback to close the dialog */
  onClose: () => void;
  /** Flag indicating if the user has the org capability to bypass the max limit */
  canBypassPIDsLimit?: boolean;
}

const MachineConfiguration: React.FC<MachineConfigurationProps> = (props) => {
  const {
    clusterID,
    getMachineConfiguration,
    createMachineConfiguration,
    updateMachineConfiguration,
    canBypassPIDsLimit,
    onClose,
  } = props;

  const {
    getKubeletConfig,
    kubeletConfig,
    isLoading,
    error: loadingError,
  } = useGetKubeletConfig(getMachineConfiguration);

  const {
    saveKubeletConfig,
    isSaving,
    kubeletConfig: savedKubeletConfig,
    error: savingError,
  } = useSaveKubeletConfig(createMachineConfiguration, updateMachineConfiguration);

  useEffect(() => {
    getKubeletConfig(clusterID);
  }, [clusterID, getKubeletConfig]);

  useEffect(() => {
    if (savedKubeletConfig) {
      onClose();
    }
  }, [onClose, savedKubeletConfig]);

  const handleSave = (config: KubeletConfig) => {
    const patchedConfig = omit(config, ['kind', 'href']);
    saveKubeletConfig(clusterID, patchedConfig, kubeletConfig === null ? 'post' : 'patch');
  };

  return (
    <MachineConfigurationModal onClose={onClose}>
      {loadingError ? (
        <MachineConfigurationLoadingError onClose={onClose} />
      ) : (
        <MachineConfigurationEditor
          config={kubeletConfig}
          canBypassPIDsLimit={canBypassPIDsLimit}
          onCancel={onClose}
          onSave={handleSave}
          isLoading={isLoading}
          isSaving={isSaving}
          savingError={savingError}
        />
      )}
    </MachineConfigurationModal>
  );
};

export { MachineConfiguration };
