import { produce } from 'immer';

import { ViewOptionsAction } from '~/redux/actions/viewOptionsActions';
import { viewPaginationConstants } from '~/redux/constants';
import { PromiseActionType, PromiseReducerState } from '~/redux/types';
import { ClusterLog } from '~/types/service_logs.v1';

import { getErrorState } from '../../../../../common/errors';
import {
  baseRequestState,
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
} from '../../../../../redux/reduxHelpers';

import { ClusterLogAction } from './clusterLogActions';
import { GET_CLUSTER_LOGS, RESET_CLUSTER_HISTORY } from './clusterLogConstants';

/* ARCHIVED DO NOT USE */
/* This file exists to support unused files that are currently archived.  No new imports from this page */

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
  // eslint-disable-next-line default-param-last
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
      case viewPaginationConstants.VIEW_RESET_FILTERS_AND_FLAGS:
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
/* ARCHIVED DO NOT USE */
