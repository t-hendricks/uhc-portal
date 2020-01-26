
import produce from 'immer';

import { OPEN_MODAL, CLOSE_MODAL } from './ModalConstants';

const initialState = {
  modalName: null,
  data: {},
};

function modalReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
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
  });
}

modalReducer.initialState = initialState;

export default modalReducer;
