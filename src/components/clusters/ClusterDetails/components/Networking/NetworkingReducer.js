import produce from 'immer';
import {
  REJECTED_ACTION,
  PENDING_ACTION,
  FULFILLED_ACTION,
  baseRequestState,
} from '../../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../../common/errors';
import { networkingConstants } from './NetworkingConstants';

const initialState = {
  getRouters: {
    ...baseRequestState,
    routers: [],
  },
  editRouters: {
    ...baseRequestState,
  },
};

function NetworkingReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      // GET_CLUSTER_ROUTERS
      case REJECTED_ACTION(networkingConstants.GET_CLUSTER_ROUTERS):
        draft.getRouters = {
          ...initialState,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(networkingConstants.GET_CLUSTER_ROUTERS):
        draft.getRouters.pending = true;
        break;
      case FULFILLED_ACTION(networkingConstants.GET_CLUSTER_ROUTERS):
        draft.getRouters = {
          ...initialState,
          routers: action.payload.data.items || [],
          fulfilled: true,
        };
        break;

      // EDIT_CLUSTER_ROUTER
      case REJECTED_ACTION(networkingConstants.EDIT_CLUSTER_ROUTERS):
        draft.editRouters = {
          ...initialState,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(networkingConstants.EDIT_CLUSTER_ROUTERS):
        draft.editRouters.pending = true;
        break;
      case FULFILLED_ACTION(networkingConstants.EDIT_CLUSTER_ROUTERS):
        draft.editRouters = {
          ...baseRequestState,
          fulfilled: true,
        };
        break;

      // RESET_EDIT_ROUTERS_RESPONSE
      case networkingConstants.RESET_EDIT_ROUTERS_RESPONSE:
        draft.editRouters = {
          ...baseRequestState,
        };
        break;

      // RESET_CLUSTER_ROUTERS
      case networkingConstants.RESET_CLUSTER_ROUTERS:
        return initialState;
    }
  });
}

NetworkingReducer.initialState = initialState;

export { initialState, NetworkingReducer };

export default NetworkingReducer;
