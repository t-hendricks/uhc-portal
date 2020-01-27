import {
  setStateProp, REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION, baseRequestState,
} from '../reduxHelpers';
import { getErrorState } from '../../common/errors';

import { cloudProviderConstants } from '../constants';

const initialState = {
  cloudProviders: {
    ...baseRequestState,
    providers: {},
  },
};

function cloudProvidersReducer(state = initialState, action) {
  switch (action.type) {
    case REJECTED_ACTION(cloudProviderConstants.GET_CLOUD_PROVIDERS):
      return setStateProp(
        'cloudProviders',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case PENDING_ACTION(cloudProviderConstants.GET_CLOUD_PROVIDERS):
      return setStateProp(
        'cloudProviders',
        {
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case FULFILLED_ACTION(cloudProviderConstants.GET_CLOUD_PROVIDERS):
      return setStateProp(
        'cloudProviders',
        {
          providers: action.payload,
          pending: false,
          fulfilled: true,
          error: false, // Unset error on successful request
          errorMessage: '',
        },
        {
          state,
          initialState,
        },
      );
    default:
      return state;
  }
}
cloudProvidersReducer.initialState = initialState;

export { initialState, cloudProvidersReducer };

export default cloudProvidersReducer;
