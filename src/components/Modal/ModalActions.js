import { modalConstants } from './ModalConstants';

const openModal = (modalName, data) => ({
  type: modalConstants.OPEN_MODAL,
  payload: { name: modalName, data },
});

const closeModal = () => ({
  type: modalConstants.CLOSE_MODAL,
});

const modalActions = { openModal, closeModal };

export { modalActions, closeModal, openModal };
