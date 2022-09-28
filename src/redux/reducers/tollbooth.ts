import { ACTION_TYPE as tollboothActionType } from '../actions/tollbooth';
import { getErrorState } from '../../common/errors';

const initialState = { token: {} };

const tollboothReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${tollboothActionType}_FULFILLED`:
      return { ...state, token: action.payload.data };
    case `${tollboothActionType}_REJECTED`:
      return {
        ...state,
        token: getErrorState(action),
      };
    default:
      return state;
  }
};

export default tollboothReducer;
