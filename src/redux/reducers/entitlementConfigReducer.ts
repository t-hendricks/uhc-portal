import {
  REJECTED_ACTION,
  PENDING_ACTION,
  FULFILLED_ACTION,
  baseRequestState,
} from '../reduxHelpers';
import CREATE_ENTITLEMENT_CONFIG from '../constants/entitlementConfigConstants';
import type { PromiseActionType, PromiseReducerState } from '../types';
import type { TokensAction } from '../actions/tokensActions';

type State = PromiseReducerState;

const initialState: State = {
  ...baseRequestState,
};

function entitlementConfigReducer(
  state = initialState,
  action: PromiseActionType<TokensAction>,
): State {
  switch (action.type) {
    case REJECTED_ACTION(CREATE_ENTITLEMENT_CONFIG):
      return {
        ...initialState,
        // can't use getErrorState here - this is not using an OCM api.
        error: true,
        errorCode: -1,
        fulfilled: false,
      };

    case PENDING_ACTION(CREATE_ENTITLEMENT_CONFIG):
      return {
        ...state,
        pending: true,
      };

    case FULFILLED_ACTION(CREATE_ENTITLEMENT_CONFIG):
      return {
        ...initialState,
        fulfilled: true,
      };
    default:
      return state;
  }
}

export { initialState };
export default entitlementConfigReducer;
