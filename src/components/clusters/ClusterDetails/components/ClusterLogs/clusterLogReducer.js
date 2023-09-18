import produce from 'immer';
import {
  baseRequestState,
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
} from '../../../../../redux/reduxHelpers';
import { viewPaginationConstants } from '../../../../../redux/constants';
import { GET_CLUSTER_LOGS, RESET_CLUSTER_HISTORY } from './clusterLogConstants';
import { getErrorState } from '../../../../../common/errors';

const initialState = {
  requestState: baseRequestState,
  logs: [],
  fetchedClusterLogsAt: undefined,
};

function clusterLogReducer(state = initialState, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case PENDING_ACTION(GET_CLUSTER_LOGS):
        draft.requestState = {
          ...baseRequestState,
          pending: true,
        };
        break;

      case FULFILLED_ACTION(GET_CLUSTER_LOGS):
        draft.requestState = {
          ...baseRequestState,
          fulfilled: true,
        };
        draft.logs = action.payload.logs.data.items;
        draft.fetchedClusterLogsAt = new Date();
        break;

      case REJECTED_ACTION(GET_CLUSTER_LOGS):
        draft.logs = [];
        draft.requestState = { ...getErrorState(action) };
        draft.fetchedClusterLogsAt = new Date();
        break;

      case viewPaginationConstants.VIEW_CLEAR_FILTERS_AND_FLAGS:
        draft.requestState = baseRequestState;
        break;

      case RESET_CLUSTER_HISTORY:
        draft.requestState = baseRequestState;
        break;

      default:
        break;
    }
  });
}

clusterLogReducer.initialState = initialState;

export { initialState, clusterLogReducer };

export default clusterLogReducer;
