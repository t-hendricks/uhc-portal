import produce from 'immer';
import {
  baseRequestState,
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
} from '../../../../../redux/reduxHelpers';
import { viewPaginationConstants } from '../../../../../redux/constants';
import {
  DOWNLOAD_CLUSTER_LOGS,
  GET_CLUSTER_LOGS,
  RESET_CLUSTER_HISTORY,
} from './clusterLogConstants';
import { getErrorState } from '../../../../../common/errors';

const initialState = {
  requestState: baseRequestState,
  requestDownloadState: baseRequestState,
  logs: [],
  data: undefined,
  format: '',
  fetchedClusterLogsAt: undefined,
};

function clusterLogReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
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
        break;

      case viewPaginationConstants.VIEW_CLEAR_FILTERS_AND_FLAGS:
        draft.requestState = baseRequestState;
        break;

      case PENDING_ACTION(DOWNLOAD_CLUSTER_LOGS):
        draft.requestDownloadState = {
          ...baseRequestState,
          pending: true,
        };
        draft.data = undefined;
        break;

      case FULFILLED_ACTION(DOWNLOAD_CLUSTER_LOGS):
        draft.requestDownloadState = {
          ...baseRequestState,
          fulfilled: true,
        };
        draft.data = action.payload.response.data;
        draft.format = action.payload.format;
        break;

      case REJECTED_ACTION(DOWNLOAD_CLUSTER_LOGS):
        draft.requestDownloadState = { ...getErrorState(action) };
        draft.data = undefined;
        break;
      case RESET_CLUSTER_HISTORY:
        draft.requestState = baseRequestState;
        break;
    }
  });
}

clusterLogReducer.initialState = initialState;

export { initialState, clusterLogReducer };

export default clusterLogReducer;
