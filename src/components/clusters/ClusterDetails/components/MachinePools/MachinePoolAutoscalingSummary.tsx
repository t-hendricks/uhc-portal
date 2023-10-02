import React from 'react';
import { TextContent, Tooltip } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import globalWarningColor100 from '@patternfly/react-tokens/dist/esm/global_warning_color_100';

const MachinePoolAutoScalingSummary = ({
  hasClusterAutoscale,
  hasMachinePoolAutoscale,
  isHypershift,
}: {
  hasClusterAutoscale: boolean;
  hasMachinePoolAutoscale: boolean;
  isHypershift: boolean;
}) => {
  if (!isHypershift && hasMachinePoolAutoscale && !hasClusterAutoscale) {
    return (
      <Tooltip content="The machine pool autoscaling settings can not apply when the cluster autoscaler is disabled.">
        <TextContent>
          Enabled
          <ExclamationTriangleIcon
            size="sm"
            className="pf-u-ml-md"
            color={globalWarningColor100.value}
          />
        </TextContent>
      </Tooltip>
    );
  }
  return hasMachinePoolAutoscale ? 'Enabled' : 'Disabled';
};

export default MachinePoolAutoScalingSummary;
