import { produce } from 'immer';

import { getErrorState } from '../../../../common/errors';
import {
  baseRequestState,
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
} from '../../../../redux/reduxHelpers';

import {
  CLEAR_TOGGLE_SUBSCRIPTION_RELEASED_RESPONSE,
  TOGGLE_SUBSCRIPTION_RELEASED,
} from './subscriptionReleasedConstants';

const initialState = {
  requestState: baseRequestState,
  data: {},
};

// eslint-disable-next-line default-param-last
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
