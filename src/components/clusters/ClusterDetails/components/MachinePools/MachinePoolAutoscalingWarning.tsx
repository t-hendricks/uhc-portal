import React from 'react';
import { Alert } from '@patternfly/react-core';

interface WarningProps {
  hasClusterAutoScaler: boolean;
  hasAutoscalingMachinePools: boolean;
  isEnabledOnCurrentPool?: boolean;
  warningType: 'editMachinePool' | 'addMachinePool' | 'clusterView';
}

const MachinePoolsAutoScalingWarning = ({
  hasClusterAutoScaler,
  hasAutoscalingMachinePools,
  isEnabledOnCurrentPool,
  warningType,
}: WarningProps) => {
  let message: React.ReactNode | string = '';
  let title = '';
  switch (warningType) {
    case 'clusterView':
      if (!hasClusterAutoScaler && hasAutoscalingMachinePools) {
        title = 'Machine pools will not autoscale';
        message =
          'No machine pools can autoscale because of your autoscaling settings. To apply autoscaling to the machine pools, click on the "Autoscale cluster" toggle above.';
      } else if (hasClusterAutoScaler && !hasAutoscalingMachinePools) {
        title = 'Cluster will not autoscale';
        message =
          'The cluster autoscaling settings will not have any effect as no machine pools are set to autoscale.';
      }
      break;
    case 'addMachinePool':
    case 'editMachinePool':
      if (hasClusterAutoScaler && !isEnabledOnCurrentPool && !hasAutoscalingMachinePools) {
        title = 'Cluster will not autoscale';
        message =
          'Without machine pools which are configured to autoscale, the cluster autoscaler settings will not have any effect on the cluster.';
      } else if (!hasClusterAutoScaler && isEnabledOnCurrentPool) {
        title = 'Machine pool will not autoscale';
        message = 'To apply autoscaling to the machine pool, enable also the cluster autoscaler.';
      }
      break;
    default:
      break;
  }
  return message ? (
    <Alert id="inconsistent-autoscaling-settings" variant="warning" isInline title={title}>
      {message}
    </Alert>
  ) : null;
};

export default MachinePoolsAutoScalingWarning;
