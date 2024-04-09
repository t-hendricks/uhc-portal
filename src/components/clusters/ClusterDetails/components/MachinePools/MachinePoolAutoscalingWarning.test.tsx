import React from 'react';

import { render, screen } from '~/testUtils';

import MachinePoolsAutoScalingWarning, { WarningProps } from './MachinePoolAutoscalingWarning';

describe('<MachinePoolAutoscalingWarning />', () => {
  const mpMessage =
    'Without machine pools which are configured to autoscale, the cluster autoscaler settings will not have any effect on the cluster.';
  const clusterMessage =
    'The cluster autoscaling settings will not have any effect as no machine pools are set to autoscale.';

  const testCases: [WarningProps, string | null][] = [
    [
      {
        warningType: 'clusterView',
        hasClusterAutoScaler: true,
        hasAutoscalingMachinePools: true,
        isEnabledOnCurrentPool: true,
      },
      null,
    ],
    [
      {
        warningType: 'clusterView',
        hasClusterAutoScaler: true,
        hasAutoscalingMachinePools: false,
        isEnabledOnCurrentPool: false,
      },
      clusterMessage,
    ],
    [
      {
        warningType: 'clusterView',
        hasClusterAutoScaler: false,
        hasAutoscalingMachinePools: true,
        isEnabledOnCurrentPool: true,
      },
      null,
    ],
    [
      {
        warningType: 'addMachinePool',
        hasClusterAutoScaler: true,
        hasAutoscalingMachinePools: true,
        isEnabledOnCurrentPool: true,
      },
      null,
    ],
    [
      {
        warningType: 'addMachinePool',
        hasClusterAutoScaler: true,
        hasAutoscalingMachinePools: false,
        isEnabledOnCurrentPool: true,
      },
      null,
    ],
    [
      {
        warningType: 'addMachinePool',
        hasClusterAutoScaler: true,
        hasAutoscalingMachinePools: false,
        isEnabledOnCurrentPool: false,
      },
      mpMessage,
    ],
    [
      {
        warningType: 'addMachinePool',
        hasClusterAutoScaler: false,
        hasAutoscalingMachinePools: true,
        isEnabledOnCurrentPool: true,
      },
      null,
    ],
    [
      {
        warningType: 'addMachinePool',
        hasClusterAutoScaler: false,
        hasAutoscalingMachinePools: false,
        isEnabledOnCurrentPool: false,
      },
      null,
    ],
  ];

  describe('Shows a machine warning', () => {
    it.each(testCases)(
      'test case %p - should show message: %p',
      (props: WarningProps, resultMessage: string | null) => {
        // Arrange
        const testId = 'inconsistent-autoscaling-settings';

        // Act
        render(<MachinePoolsAutoScalingWarning {...props} />);

        // Assert
        if (resultMessage) {
          expect(screen.getByTestId(testId)).toHaveTextContent(resultMessage);
        } else {
          expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
        }
      },
    );
  });
});
