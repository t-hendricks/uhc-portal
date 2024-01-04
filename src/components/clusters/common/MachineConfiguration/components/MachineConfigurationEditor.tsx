/* eslint-disable camelcase */
import React, { useEffect, useMemo, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { KubeletConfig } from '~/types/clusters_mgmt.v1';
import { ActionGroup, Button, Form, Stack, StackItem } from '@patternfly/react-core';
import { PIDsLimitInput } from '~/components/clusters/common/MachineConfiguration/components/PIDsLimitInput';
import { MachineConfigurationSkeleton } from '~/components/clusters/common/MachineConfiguration/components/MachineConfigurationSkeleton';
import ErrorBox from '~/components/common/ErrorBox';
import { getErrorMessage } from '~/common/errors';
import { usePIDsLimitValidation } from '~/components/clusters/common/MachineConfiguration/usePIDsLimitValidation';
import {
  PIDS_LIMIT_MAX,
  PIDS_LIMIT_MAX_OVERRIDE,
  PIDS_LIMIT_MIN,
} from '~/components/clusters/common/machinePools/constants';

interface MachineConfigurationEditorProps {
  config?: KubeletConfig | null;
  canBypassPIDsLimit?: boolean;
  onSave: (config: KubeletConfig) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isSaving?: boolean;
  savingError?: unknown;
}

const MachineConfigurationEditor: React.FC<MachineConfigurationEditorProps> = (props) => {
  const {
    config,
    onSave,
    onCancel,
    isLoading,
    isSaving,
    canBypassPIDsLimit = false,
    savingError,
  } = props;

  const PIDsMinValue = PIDS_LIMIT_MIN;
  const PIDsMaxValue = canBypassPIDsLimit ? PIDS_LIMIT_MAX_OVERRIDE : PIDS_LIMIT_MAX;

  const [editingConfig, setEditingConfig] = useState<KubeletConfig>({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const defaultValue: KubeletConfig = {
      pod_pids_limit: PIDsMinValue,
    };

    if (config || config === null) {
      setEditingConfig(config ? { ...config } : defaultValue);
      if (!isReady) {
        setIsReady(true);
      }
    }
  }, [PIDsMinValue, config, isLoading, isReady]);

  const handlePIDsLimitChange = (pod_pids_limit: number) => {
    if (pod_pids_limit !== editingConfig.pod_pids_limit) {
      setEditingConfig((prev) => ({ ...prev, pod_pids_limit }));
    }
  };

  const handleSave = () => {
    onSave(editingConfig);
  };

  const { isValid, isPIDsLimitUnsafe, validationMessage } = usePIDsLimitValidation(
    editingConfig?.pod_pids_limit,
    PIDsMinValue,
    PIDsMaxValue,
    canBypassPIDsLimit,
  );

  const isChanged = useMemo(() => {
    if (isReady) {
      const initialValue = config === null ? PIDsMinValue : config?.pod_pids_limit;
      return editingConfig.pod_pids_limit !== initialValue;
    }
    return false;
  }, [PIDsMinValue, config, editingConfig.pod_pids_limit, isReady]);

  const isSaveDisabled = useMemo(
    () => !isReady || isLoading || isSaving || !isValid || !isChanged,
    [isReady, isLoading, isSaving, isValid, isChanged],
  );

  return (
    <Stack hasGutter>
      {savingError && (
        <StackItem>
          <ErrorBox
            message="There was an error saving the machine configuration"
            response={getErrorProperties(savingError)}
          />
        </StackItem>
      )}
      <StackItem>
        <Form>
          {!isReady ? (
            <MachineConfigurationSkeleton />
          ) : (
            <PIDsLimitInput
              value={editingConfig.pod_pids_limit}
              minValue={PIDsMinValue}
              maxValue={PIDsMaxValue}
              onChange={handlePIDsLimitChange}
              isValid={isValid}
              validationMessage={validationMessage}
              isUnsafe={isPIDsLimitUnsafe}
              safeMaxValue={PIDS_LIMIT_MAX}
            />
          )}
          <ActionGroup>
            <Button
              variant="primary"
              onClick={handleSave}
              isDisabled={isSaveDisabled}
              isLoading={isSaving}
            >
              Save changes
            </Button>
            <Button variant="link" onClick={onCancel} isDisabled={isLoading || isSaving}>
              Cancel
            </Button>
          </ActionGroup>
        </Form>
      </StackItem>
    </Stack>
  );
};

export { MachineConfigurationEditor };

const getErrorProperties = (error: unknown) => {
  const errorData = axios.isAxiosError(error) ? (error.response?.data as any) : undefined;
  return {
    errorDetails: errorData?.details ?? [],
    errorMessage: getErrorMessage({ payload: error as AxiosError }),
    operationID: errorData?.operation_id,
  };
};
