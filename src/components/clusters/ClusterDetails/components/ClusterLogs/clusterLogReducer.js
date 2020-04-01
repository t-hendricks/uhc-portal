import produce from 'immer';
import {
  baseRequestState,
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
} from '../../../../../redux/reduxHelpers';
import {
  DOWNLOAD_CLUSTER_LOGS,
  GET_CLUSTER_LOGS,
} from './clusterLogConstants';
import { getErrorState } from '../../../../../common/errors';

const initialState = {
  requestState: baseRequestState,
  requestDownloadState: baseRequestState,
  externalClusterID: undefined,
  logs: [],
  data: undefined,
  format: '',
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
        draft.externalClusterID = action.payload.externalClusterID;
        draft.requestState = {
          ...baseRequestState,
          fulfilled: true,
        };
        draft.logs = action.payload.logs.data.items;
        break;

      case REJECTED_ACTION(GET_CLUSTER_LOGS):
        draft.externalClusterID = action.payload.externalClusterID;
        draft.logs = [];
        draft.requestState = { ...getErrorState(action) };
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
    }
  });
}

clusterLogReducer.initialState = initialState;

export { initialState, clusterLogReducer };

export default clusterLogReducer;
