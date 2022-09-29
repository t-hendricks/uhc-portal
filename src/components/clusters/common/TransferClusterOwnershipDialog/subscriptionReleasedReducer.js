import produce from 'immer';

import {
  REJECTED_ACTION,
  PENDING_ACTION,
  FULFILLED_ACTION,
  baseRequestState,
} from '../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../common/errors';

import {
  TOGGLE_SUBSCRIPTION_RELEASED,
  CLEAR_TOGGLE_SUBSCRIPTION_RELEASED_RESPONSE,
} from './subscriptionReleasedConstants';

const initialState = {
  requestState: baseRequestState,
  data: {},
};

function subscriptionReleasedReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      // TOGGLE_SUBSCRIPTION_RELEASED
      case PENDING_ACTION(TOGGLE_SUBSCRIPTION_RELEASED):
        draft.requestState = { ...baseRequestState, pending: true };
        break;

      case REJECTED_ACTION(TOGGLE_SUBSCRIPTION_RELEASED):
        draft.requestState = getErrorState(action);
        break;

      case FULFILLED_ACTION(TOGGLE_SUBSCRIPTION_RELEASED):
        draft.requestState = { ...baseRequestState, fulfilled: true };
        draft.data = action.payload.data;
        break;

      // CLEAR_TOGGLE_SUBSCRIPTION_RELEASED_RESPONSE
      case CLEAR_TOGGLE_SUBSCRIPTION_RELEASED_RESPONSE:
        return initialState;
    }
  });
}

subscriptionReleasedReducer.initialState = initialState;

export { initialState, subscriptionReleasedReducer };

export default subscriptionReleasedReducer;
