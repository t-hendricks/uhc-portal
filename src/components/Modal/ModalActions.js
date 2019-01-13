import { modalConstants } from './ModalConstants';

const openModal = modalName => ({
  type: modalConstants.OPEN_MODAL,
  payload: modalName,
});

const closeModal = () => ({
  type: modalConstants.CLOSE_MODAL,
});

const modalActions = { openModal, closeModal };

export { modalActions, closeModal, openModal };
