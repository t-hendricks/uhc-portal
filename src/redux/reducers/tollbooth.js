import get from 'lodash/get';
import { ACTION_TYPE as tollboothActionType } from '../actions/tollbooth';
import helpers from '../../common/helpers';

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
            code: get(action.payload, 'response.data.code'),
            message: helpers.getErrorMessage(action.payload),
          },
        },
      };
    default:
      return state;
  }
};

export default tollboothReducer;
