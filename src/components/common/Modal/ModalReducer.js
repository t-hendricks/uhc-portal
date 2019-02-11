import helpers from '../../../common/helpers';
import { modalConstants } from './ModalConstants';

const initialState = {
  activeModal: { modalName: null, data: {} },
};

function modalReducer(state = initialState, action) {
  switch (action.type) {
    case modalConstants.OPEN_MODAL:
      return helpers.setStateProp(
        'activeModal',
        {
          modalName: action.payload.name,
          data: action.payload.data || {},
        },
        {
          state,
          initialState,
        },
      );

    case modalConstants.CLOSE_MODAL:
      return helpers.setStateProp(
        'activeModal',
        {
          modalName: null,
          data: {},
        },
        {
          state,
          initialState,
        },
      );
    default:
      return state;
  }
}

modalReducer.initialState = initialState;

export default modalReducer;
