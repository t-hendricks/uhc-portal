import produce from 'immer';

import {
  REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION, baseRequestState,
} from '../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../common/errors';
import {
  VALIDATE_CLOUD_PROVIDER_CREDENTIALS,
  CLEAR_ALL_CLOUD_PROVIDER_INQUIRIES,
} from './ccsInquiriesActions';

const initialState = {
  ccsCredentialsValidity: {
    ...baseRequestState,
    credentials: undefined,
  },
};

function ccsInquiriesReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case PENDING_ACTION(VALIDATE_CLOUD_PROVIDER_CREDENTIALS):
        draft.ccsCredentialsValidity.pending = true;
        break;
      case FULFILLED_ACTION(VALIDATE_CLOUD_PROVIDER_CREDENTIALS):
        draft.ccsCredentialsValidity = {
          ...initialState.ccsCredentialsValidity,
          fulfilled: true,
          credentials: action.payload?.credentials,
          cloudProvider: action.payload?.cloudProvider,
        };
        break;
      case REJECTED_ACTION(VALIDATE_CLOUD_PROVIDER_CREDENTIALS):
        draft.ccsCredentialsValidity = {
          ...initialState,
          ...getErrorState(action),
        };
        break;
      case CLEAR_ALL_CLOUD_PROVIDER_INQUIRIES:
        return { ...initialState };
    }
  });
}

ccsInquiriesReducer.initialState = initialState;

export { initialState };

export default ccsInquiriesReducer;
