import { ACTION_TYPE as tollboothActionType } from '../actions/tollbooth';

const initialState = { token: {} };

const tollboothReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${tollboothActionType}_FULFILLED`:
      return { ...state, token: action.payload.data };
    case `${tollboothActionType}_REJECTED`:
      return {
        ...state,
        token: {
          error: {
            msg: 'Failed to obtain authorization token.',
            status: action.payload.response.status,
          },
        },
      };
    default:
      return state;
  }
};

export default tollboothReducer;
