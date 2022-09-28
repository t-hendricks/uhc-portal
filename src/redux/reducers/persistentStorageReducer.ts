import produce from 'immer';
import {
  REJECTED_ACTION,
  PENDING_ACTION,
  FULFILLED_ACTION,
  baseRequestState,
} from '../reduxHelpers';
import { getErrorState } from '../../common/errors';

import { persistentStorageConstants } from '../constants';

const initialState = {
  ...baseRequestState,
  values: [],
};

function persistentStorageReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case REJECTED_ACTION(persistentStorageConstants.GET_PERSISTENT_STORAGE_VALUES):
        return {
          ...initialState,
          ...getErrorState(action),
        };
      case PENDING_ACTION(persistentStorageConstants.GET_PERSISTENT_STORAGE_VALUES):
        draft.pending = true;
        break;
      case FULFILLED_ACTION(persistentStorageConstants.GET_PERSISTENT_STORAGE_VALUES):
        return {
          ...initialState,
          fulfilled: true,
          values: action.payload,
        };
    }
  });
}
persistentStorageReducer.initialState = initialState;

export { initialState, persistentStorageReducer };

export default persistentStorageReducer;
