import { AxiosResponse } from 'axios';

import { SHOW_API_ERROR, CLEAR_API_ERROR, ApiErrorAction } from './ApiErrorActions';

type State = AxiosResponse | null;

const initialState: State = null;

const apiErrorReducer = (state = initialState, action: ApiErrorAction): State => {
  switch (action.type) {
    case SHOW_API_ERROR:
      return action.payload;
    case CLEAR_API_ERROR:
      return initialState;
    default:
      return state;
  }
};

export default apiErrorReducer;
