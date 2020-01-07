import { setStateProp } from '../../../redux/reduxHelpers';
import { modalConstants } from './ModalConstants';

const initialState = {
  activeModal: { modalName: null, data: {} },
};

function modalReducer(state = initialState, action) {
  switch (action.type) {
    case modalConstants.OPEN_MODAL:
      return setStateProp(
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
      return setStateProp(
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
