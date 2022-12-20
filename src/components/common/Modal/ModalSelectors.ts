import { GlobalState } from '~/redux/store';

const shouldShowModal = (state: GlobalState, id: string) => state.modal.modalName === id;

export default shouldShowModal;
