import produce from 'immer';
import { ModalActions } from './ModalActions';

import { OPEN_MODAL, CLOSE_MODAL } from './ModalConstants';

export type State = {
  modalName: string | null;
  data: unknown;
};

const initialState: State = {
  modalName: null,
  data: {},
};

function modalReducer(state = initialState, action: ModalActions) {
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case OPEN_MODAL:
        draft.modalName = action.payload.name;
        draft.data = action.payload.data || {};
        break;

      case CLOSE_MODAL:
        return initialState;
    }
    return draft;
  });
}

modalReducer.initialState = initialState;

export default modalReducer;
