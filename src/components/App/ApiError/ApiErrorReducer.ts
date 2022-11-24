import produce from 'immer';

import { SHOW_API_ERROR, CLEAR_API_ERROR } from './ApiErrorActions';

const initialState = null;

function apiErrorReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, () => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case SHOW_API_ERROR:
        return action.payload;
      case CLEAR_API_ERROR:
        return initialState;
    }
  });
}

apiErrorReducer.initialState = initialState;

export default apiErrorReducer;
