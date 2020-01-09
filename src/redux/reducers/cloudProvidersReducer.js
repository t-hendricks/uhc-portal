import helpers, { setStateProp } from '../reduxHelpers';
import { getErrorState } from '../../common/errors';

import { cloudProviderConstants } from '../constants';

const initialState = {
  cloudProviders: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    providers: {},
  },
};

function cloudProvidersReducer(state = initialState, action) {
  switch (action.type) {
    case helpers.REJECTED_ACTION(cloudProviderConstants.GET_CLOUD_PROVIDERS):
      return setStateProp(
        'cloudProviders',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(cloudProviderConstants.GET_CLOUD_PROVIDERS):
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

    case helpers.FULFILLED_ACTION(cloudProviderConstants.GET_CLOUD_PROVIDERS):
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
