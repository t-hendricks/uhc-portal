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
      title="Delete Machine Pool"
      onPrimaryClick={handleConfirmDelete}
      onSecondaryClick={closeModal}
      isOpen
      onClose={closeModal}
    >
      Are you sure you want to delete &quot;{machinePoolId}&quot;?
    </Modal>
  );
};

export default DeleteMachinePoolModal;
