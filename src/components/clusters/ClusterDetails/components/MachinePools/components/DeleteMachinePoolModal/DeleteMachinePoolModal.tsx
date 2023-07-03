import React from 'react';
import Modal from '~/components/common/Modal/Modal';

type Props = {
  performDeleteAction: () => void;
  closeModal: () => void;
  machinePoolId: string;
};

const DeleteMachinePoolModal = ({ closeModal, machinePoolId, performDeleteAction }: Props) => {
  const handleConfirmDelete = () => {
    performDeleteAction();
    closeModal();
  };

  return (
    <Modal
      title="Permanently delete machine pool?"
      primaryText="Delete"
      onPrimaryClick={handleConfirmDelete}
      secondaryText="Cancel"
      onSecondaryClick={closeModal}
      isOpen
      onClose={closeModal}
    >
      &quot;{machinePoolId}&quot; will be lost.
    </Modal>
  );
};

export default DeleteMachinePoolModal;
