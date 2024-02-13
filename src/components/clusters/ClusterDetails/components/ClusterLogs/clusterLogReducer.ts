import { produce } from 'immer';
import { PromiseActionType, PromiseReducerState } from '~/redux/types';
import { ClusterLog } from '~/types/service_logs.v1';
import { ViewOptionsAction } from '~/redux/actions/viewOptionsActions';
import { viewPaginationConstants } from '~/redux/constants';
import { getErrorState } from '../../../../../common/errors';
import {
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
  baseRequestState,
} from '../../../../../redux/reduxHelpers';
import { GET_CLUSTER_LOGS, RESET_CLUSTER_HISTORY } from './clusterLogConstants';
import { ClusterLogAction } from './clusterLogActions';

export type State = {
  requestState: PromiseReducerState<{}>;
  logs?: Array<ClusterLog>;
  fetchedClusterLogsAt?: Date;
};

const initialState: State = {
  requestState: { ...baseRequestState },
  logs: [],
  fetchedClusterLogsAt: undefined,
};

const clusterLogReducer = (
  state: State = initialState,
  action: PromiseActionType<ClusterLogAction | ViewOptionsAction>,
) =>
  produce(state, (draft) => {
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

clusterLogReducer.initialState = initialState;

export { initialState, clusterLogReducer };

export default clusterLogReducer;
