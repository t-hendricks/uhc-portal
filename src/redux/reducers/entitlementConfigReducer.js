import produce from 'immer';
import {
  REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION, baseRequestState,
} from '../reduxHelpers';
import CREATE_ENTITLEMENT_CONFIG from '../constants/entitlementConfigConstants';

const initialState = {
  ...baseRequestState,
  entitlementConfig: {},
};

function entitlementConfigReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case REJECTED_ACTION(CREATE_ENTITLEMENT_CONFIG):
        return {
          ...initialState,
          // can't use getErrorState here - this is not using an OCM api.
          error: true,
        };

      case PENDING_ACTION(CREATE_ENTITLEMENT_CONFIG):
        draft.pending = true;
        break;

      case FULFILLED_ACTION(CREATE_ENTITLEMENT_CONFIG):
        return {
          ...initialState,
          fulfilled: true,
        };
    }
  });
}

export { initialState };
export default entitlementConfigReducer;
