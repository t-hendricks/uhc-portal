import helpers, { setStateProp } from '../reduxHelpers';
import { getErrorState } from '../../common/errors';

import { persistentStorageConstants } from '../constants';

const initialState = {
  persistentStorageValues: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    values: [],
  },
};

function persistentStorageReducer(state = initialState, action) {
  switch (action.type) {
    case helpers.REJECTED_ACTION(persistentStorageConstants.GET_PERSISTENT_STORAGE_VALUES):
      return setStateProp(
        'persistentStorageValues',
        getErrorState(action),
        {
          state,
          initialState,
        },
      );

    case helpers.PENDING_ACTION(persistentStorageConstants.GET_PERSISTENT_STORAGE_VALUES):
      return setStateProp(
        'persistentStorageValues',
        {
          pending: true,
        },
        {
          state,
          initialState,
        },
      );

    case helpers.FULFILLED_ACTION(persistentStorageConstants.GET_PERSISTENT_STORAGE_VALUES):
      return setStateProp(
        'persistentStorageValues',
        {
          values: action.payload,
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
persistentStorageReducer.initialState = initialState;

export { initialState, persistentStorageReducer };

export default persistentStorageReducer;
