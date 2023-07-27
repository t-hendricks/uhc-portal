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

  const modalData = useGlobalState((state) => state.modal.data);
  const machinePoolModalText =
    isModalData(modalData) && `"${modalData.machinePool?.id}" will be lost.`;
  const performDeleteAction = isModalData(modalData) && modalData.performDeleteAction;
  const dispatch = useDispatch();

  const handleConfirmDelete = () => {
    dispatch(closeModal());
    performDeleteAction();
  };

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
      {machinePoolModalText}
    </Modal>
  );
};

export default DeleteMachinePoolModal;
