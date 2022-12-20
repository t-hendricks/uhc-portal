import { action, ActionType } from 'typesafe-actions';
import { CLOSE_MODAL, OPEN_MODAL } from './ModalConstants';

const openModal = (modalName: string, data?: unknown) =>
  action(OPEN_MODAL, { name: modalName, data });

const closeModal = () => action(CLOSE_MODAL);

const modalActions = { openModal, closeModal };

type ModalActions = ActionType<typeof modalActions>;

export { modalActions, closeModal, openModal, ModalActions };
