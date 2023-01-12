import { AxiosResponse } from 'axios';
import { FULFILLED_ACTION, REJECTED_ACTION } from '../reduxHelpers';
import {
  clustersConstants,
  dashboardsConstants,
  subscriptionsConstants,
  viewConstants,
  viewPaginationConstants,
  viewOptionsConstants,
} from '../constants';
import { GET_CLUSTER_LOGS } from '../../components/clusters/ClusterDetails/components/ClusterLogs/clusterLogConstants';
import type { ViewOptionsAction } from '../actions/viewOptionsActions';
import type { PromiseActionType } from '../types';
import type { DashboardsAction } from '../actions/dashboardsActions';
import type { ClusterAction } from '../actions/clustersActions';
import type { SubscriptionsAction } from '../actions/subscriptionsActions';
import { ViewOptions } from '~/types/types';
import { ClusterLogList } from '~/types/service_logs.v1';

type ViewState = ViewOptions;

type State = { [viewType: string]: ViewState };

const INITIAL_VIEW_STATE: ViewState = {
  currentPage: 1,
  pageSize: 50,
  totalCount: 0,
  totalPages: 0,
  filter: '',
  sorting: {
    sortField: 'name',
    isAscending: true,
    sortIndex: 0,
  },
  flags: {
    showArchived: false,
  },
};

const INITIAL_OSL_VIEW_STATE: ViewState = {
  currentPage: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  filter: {
    description: '',
    loggedBy: '',
  },
  sorting: {
    sortField: 'timestamp',
    isAscending: false,
  },
  flags: {
    conditionalFilterFlags: {
      severityTypes: [],
    },
  },
};

const INITIAL_OVERVIEW_VIEW_STATE: ViewState = {
  ...INITIAL_VIEW_STATE,
  currentPage: 1,
  pageSize: 5,
  totalCount: 0,
  totalPages: 0,
};

const initialState: State = {};

initialState[viewConstants.CLUSTERS_VIEW] = Object.assign(INITIAL_VIEW_STATE);
initialState[viewConstants.ARCHIVED_CLUSTERS_VIEW] = Object.assign(INITIAL_VIEW_STATE);
initialState[viewConstants.CLUSTER_LOGS_VIEW] = Object.assign(INITIAL_OSL_VIEW_STATE);
initialState[viewConstants.OVERVIEW_VIEW] = Object.assign(INITIAL_OVERVIEW_VIEW_STATE);
initialState[viewConstants.OVERVIEW_EXPIRED_TRIALS] = Object.assign(INITIAL_OVERVIEW_VIEW_STATE);

const viewOptionsReducer = (
  state = initialState,
  action: PromiseActionType<
    | ViewOptionsAction
    | DashboardsAction
    | ClusterAction
    | SubscriptionsAction
    // TODO reference cluster logs action when `clusterLogActions.js` is converted to typescript
    | {
        type: 'GET_CLUSTER_LOGS';
        payload: Promise<{
          externalClusterID: string;
          logs: AxiosResponse<ClusterLogList>;
        }>;
      }
    // TODO create typescript action
    | {
        type: 'VIEW_MY_CLUSTERS_ONLY_CHANGED';
        // TODO refactor viewType to be part of the payload
        viewType: string;
        payload: {
          showMyClustersOnly: boolean;
        };
      }
  >,
): State => {
  const updateState: State = {};

  const updatePageCounts = (viewType: string, itemsCount: number) => {
    const totalCount = itemsCount;

    const totalPages = Math.ceil(totalCount / state[viewType].pageSize);

    updateState[viewType] = {
      ...state[viewType],
      totalCount,
      totalPages,
      currentPage: Math.min(state[viewType].currentPage, totalPages || 1),
    };
  };

  switch (action.type) {
    case viewOptionsConstants.VIEW_MY_CLUSTERS_ONLY_CHANGED:
      updateState[action.viewType] = {
        ...state[action.viewType],
        flags: {
          ...state[action.viewType].flags,
          showMyClustersOnly: action.payload.showMyClustersOnly,
        },
      };
      return { ...state, ...updateState };

    case viewPaginationConstants.VIEW_FIRST_PAGE:
      updateState[action.payload.viewType] = { ...state[action.payload.viewType], currentPage: 1 };
      return { ...state, ...updateState };

    case viewPaginationConstants.VIEW_LAST_PAGE:
      updateState[action.payload.viewType] = {
        ...state[action.payload.viewType],
        currentPage: state[action.payload.viewType].totalPages,
      };
      return { ...state, ...updateState };

    case viewPaginationConstants.VIEW_PREVIOUS_PAGE:
      if (state[action.payload.viewType].currentPage < 2) {
        return state;
      }

      updateState[action.payload.viewType] = {
        ...state[action.payload.viewType],
        currentPage: state[action.payload.viewType].currentPage - 1,
      };
      return { ...state, ...updateState };

    case viewPaginationConstants.VIEW_NEXT_PAGE:
      if (state[action.payload.viewType].currentPage >= state[action.payload.viewType].totalPages) {
        return state;
      }
      updateState[action.payload.viewType] = {
        ...state[action.payload.viewType],
        currentPage: state[action.payload.viewType].currentPage + 1,
      };
      return { ...state, ...updateState };

    case viewPaginationConstants.VIEW_PAGE_NUMBER:
      if (
        !Number.isInteger(action.payload.pageNumber) ||
        action.payload.pageNumber < 1 ||
        action.payload.pageNumber > state[action.payload.viewType].totalPages
      ) {
        return state;
      }

      updateState[action.payload.viewType] = {
        ...state[action.payload.viewType],
        currentPage: action.payload.pageNumber,
      };
      return { ...state, ...updateState };

    case viewPaginationConstants.SET_PER_PAGE:
      updateState[action.payload.viewType] = {
        ...state[action.payload.viewType],
        pageSize: action.payload.pageSize,
        // reset current page to 1, as otherwise we might be on a page that could no longer be valid
        // after changing the page size
        currentPage: 1,
      };
      return { ...state, ...updateState };

    case FULFILLED_ACTION(clustersConstants.GET_CLUSTERS):
      updatePageCounts(viewConstants.CLUSTERS_VIEW, action.payload.data.total);
      updatePageCounts(viewConstants.ARCHIVED_CLUSTERS_VIEW, action.payload.data.total);
      return { ...state, ...updateState };

    case FULFILLED_ACTION(dashboardsConstants.GET_UNHEALTHY_CLUSTERS):
      updatePageCounts(viewConstants.OVERVIEW_VIEW, action.payload.data.total);
      return { ...state, ...updateState };

    case FULFILLED_ACTION(subscriptionsConstants.GET_SUBSCRIPTIONS):
      updatePageCounts(viewConstants.OVERVIEW_EXPIRED_TRIALS, action.payload.data.total);
      return { ...state, ...updateState };

    case FULFILLED_ACTION(GET_CLUSTER_LOGS):
      updatePageCounts(viewConstants.CLUSTER_LOGS_VIEW, action.payload.logs.data.total);
      return { ...state, ...updateState };

    case REJECTED_ACTION(GET_CLUSTER_LOGS):
      updatePageCounts(viewConstants.CLUSTER_LOGS_VIEW, 0);
      return { ...state, ...updateState };

    case viewPaginationConstants.VIEW_SET_LIST_FILTER:
      updateState[action.payload.viewType] = {
        ...state[action.payload.viewType],
        filter: action.payload.filter,
        currentPage: 1,
      };
      return { ...state, ...updateState };

    case viewPaginationConstants.VIEW_CHANGE_SORT:
      updateState[action.payload.viewType] = {
        ...state[action.payload.viewType],
        sorting: action.payload.sorting,
      };
      return { ...state, ...updateState };

    case viewPaginationConstants.VIEW_SET_LIST_FLAGS:
      updateState[action.payload.viewType] = {
        ...state[action.payload.viewType],
        flags: {
          ...state[action.payload.viewType].flags,
          [action.payload.key]: action.payload.value,
        },
      };
      return { ...state, ...updateState };

    case viewPaginationConstants.VIEW_CLEAR_FILTERS_AND_FLAGS:
      updateState[action.payload.viewType] = {
        ...state[action.payload.viewType],
        flags: INITIAL_OSL_VIEW_STATE.flags,
        filter: INITIAL_OSL_VIEW_STATE.filter,
      };
      return { ...state, ...updateState };

    default:
      return state;
  }
};

viewOptionsReducer.initialState = initialState;

export { initialState, viewOptionsReducer };

export default viewOptionsReducer;
