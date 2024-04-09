import React from 'react';

import { Button, EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';

interface MachineConfigurationLoadingErrorProps {
  onClose: () => void;
}
export const MachineConfigurationLoadingError: React.FC<MachineConfigurationLoadingErrorProps> = (
  props,
) => {
  const { onClose } = props;
  return (
    <EmptyState>
      <EmptyStateIcon icon={ExclamationCircleIcon} color="var(--pf-global--danger-color--100)" />
      <Title headingLevel="h4" size="lg">
        Unable to retrieve configuration
      </Title>
      <EmptyStateBody>
        There was an error trying to retrieve the existing machine configuration. Please try again
        later.
      </EmptyStateBody>
      <Button variant="primary" onClick={onClose}>
        Close
      </Button>
    </EmptyState>
  );
};
