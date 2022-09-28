import produce from 'immer';

import {
  REJECTED_ACTION,
  PENDING_ACTION,
  FULFILLED_ACTION,
  baseRequestState,
} from '../reduxHelpers';
import { getErrorState } from '../../common/errors';

import { cloudProviderConstants } from '../constants';

const initialState = {
  ...baseRequestState,
  providers: {},
};

function cloudProvidersReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case REJECTED_ACTION(cloudProviderConstants.GET_CLOUD_PROVIDERS):
        return {
          ...initialState,
          ...getErrorState(action),
        };
      case PENDING_ACTION(cloudProviderConstants.GET_CLOUD_PROVIDERS):
        draft.pending = true;
        break;
      case FULFILLED_ACTION(cloudProviderConstants.GET_CLOUD_PROVIDERS):
        return {
          ...initialState,
          providers: action.payload,
          fulfilled: true,
        };
    }
  });
}

cloudProvidersReducer.initialState = initialState;

export { initialState, cloudProvidersReducer };

export default cloudProvidersReducer;
