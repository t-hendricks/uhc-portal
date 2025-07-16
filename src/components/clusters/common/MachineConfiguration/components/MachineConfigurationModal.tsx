import React from 'react';

import { Modal, ModalVariant } from '@patternfly/react-core/deprecated';

interface MachineConfigurationModalProps {
  children: React.ReactNode;
  onClose: () => void;
}
export const MachineConfigurationModal: React.FC<MachineConfigurationModalProps> = (props) => {
  const { children, onClose } = props;

  return (
    <Modal
      title="Edit machine configuration"
      description="Make custom edits to your machine configuration"
      variant={ModalVariant.medium}
      isOpen
      onClose={onClose}
    >
      {children}
    </Modal>
  );
};
