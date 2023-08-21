import React from 'react';
import Modal from '~/components/common/Modal/Modal';
import { useGlobalState } from '~/redux/hooks';
import { useDispatch } from 'react-redux';
import { closeModal } from '~/components/common/Modal/ModalActions';

const DeleteMachinePoolModal = () => {
  function isModalData(obj: any): obj is {
    machinePool: any;
    performDeleteAction: any;
  } {
    return typeof obj === 'object' && obj !== null;
  }

  const dispatch = useDispatch();
  const modalData = useGlobalState((state) => state.modal.data);
  const modalDataValid = isModalData(modalData);
  const { performDeleteAction } = modalData as {
    performDeleteAction: any;
  };

  const handleConfirmDelete = () => {
    dispatch(closeModal());
    performDeleteAction();
  };

  if (!modalDataValid) return null;
  return (
    <Modal
      title="Permanently delete machine pool?"
      primaryText="Delete"
      onPrimaryClick={handleConfirmDelete}
      secondaryText="Cancel"
      onSecondaryClick={() => dispatch(closeModal())}
      isOpen
      onClose={() => dispatch(closeModal())}
    >
      &quot;{modalData.machinePool?.id}&quot; will be lost.
    </Modal>
  );
};

export default DeleteMachinePoolModal;
