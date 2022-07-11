import {
  REJECTED_ACTION, FULFILLED_ACTION, PENDING_ACTION, baseRequestState,
} from '../reduxHelpers';
import { getErrorState } from '../../common/errors';

import { DEFAULT_FLAVOUR_ID } from '../actions/flavourActions';
import { GET_DEFAULT_FLAVOUR } from '../constants/flavourConstants';

export const initialState = {
  ...baseRequestState,
  // Presently we fetch only one flavour, 'osd-4', but data organized by id
  // so in future we can switch to fetching all if more than 1 needed.
  byID: {
    [DEFAULT_FLAVOUR_ID]: null,
  },
};

export default function flavoursReducer(state = initialState, action) {
  switch (action.type) {
    case PENDING_ACTION(GET_DEFAULT_FLAVOUR):
      return {
        ...state,
        pending: true,
      };

    case REJECTED_ACTION(GET_DEFAULT_FLAVOUR):
      return {
        ...initialState,
        ...getErrorState(action),
      };

    case FULFILLED_ACTION(GET_DEFAULT_FLAVOUR):
      return {
        ...initialState,
        pending: false,
        fulfilled: true,
        byID: {
          [DEFAULT_FLAVOUR_ID]: action.payload.data,
        },
      };

    default:
      return state;
  }
}
