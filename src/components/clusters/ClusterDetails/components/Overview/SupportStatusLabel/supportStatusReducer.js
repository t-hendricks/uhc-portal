import get from 'lodash/get';
import produce from 'immer';
import {
  REJECTED_ACTION,
  PENDING_ACTION,
  FULFILLED_ACTION,
  baseRequestState,
} from '../../../../../../redux/reduxHelpers';
import GET_SUPPORT_STATUS from './supportStatusConstants';

const initialState = {
  ...baseRequestState,
  supportStatus: {},
};

function supportStatusReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case REJECTED_ACTION(GET_SUPPORT_STATUS):
        return {
          ...initialState,
          // can't use getErrorState here - this is not using an OCM api.
          error: true,
        };

      case PENDING_ACTION(GET_SUPPORT_STATUS):
        draft.pending = true;
        break;

      case FULFILLED_ACTION(GET_SUPPORT_STATUS):
        return {
          ...initialState,
          fulfilled: true,
          supportStatus: get(action.payload, 'data.data[0].versions', []).reduce(
            (result, versionInfo) => {
              // eslint-disable-next-line no-param-reassign
              result[versionInfo.name] = versionInfo.type;
              return result;
            },
            {},
          ),
        };
    }
  });
}

export { initialState };
export default supportStatusReducer;
