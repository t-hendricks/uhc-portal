import helpers from '../../common/helpers';
import {
  clusterConstants,
  viewConstants,
  viewPaginationConstants,
} from '../constants';

const INITAL_VIEW_STATE = {
  currentPage: 1,
  pageSize: 50,
  totalCount: 0,
  totalPages: 0,
  filter: [],
  sorting: {
    sortField: 'name',
    isAscending: true,
  },
};

const initialState = {
};

initialState[viewConstants.CLUSTERS_VIEW] = Object.assign(INITAL_VIEW_STATE);

const viewOptionsReducer = (state = initialState, action) => {
  const updateState = {};

  const updatePageCounts = (viewType, itemsCount) => {
    const totalCount = itemsCount;

    const totalPages = Math.ceil(totalCount / state[viewType].pageSize);

    updateState[viewType] = Object.assign({}, state[viewType], {
      totalCount,
      totalPages,
      currentPage: Math.min(state[viewType].currentPage, totalPages || 1),
    });
  };

  switch (action.type) {
    case viewPaginationConstants.VIEW_FIRST_PAGE:
      updateState[action.viewType] = Object.assign({}, state[action.viewType], {
        currentPage: 1,
      });
      return Object.assign({}, state, updateState);

    case viewPaginationConstants.VIEW_LAST_PAGE:
      updateState[action.viewType] = Object.assign({}, state[action.viewType], {
        currentPage: state[action.viewType].totalPages,
      });
      return Object.assign({}, state, updateState);

    case viewPaginationConstants.VIEW_PREVIOUS_PAGE:
      if (state[action.viewType].currentPage < 2) {
        return state;
      }

      updateState[action.viewType] = Object.assign({}, state[action.viewType], {
        currentPage: state[action.viewType].currentPage - 1,
      });
      return Object.assign({}, state, updateState);

    case viewPaginationConstants.VIEW_NEXT_PAGE:
      if (state[action.viewType].currentPage >= state[action.viewType].totalPages) {
        return state;
      }
      updateState[action.viewType] = Object.assign({}, state[action.viewType], {
        currentPage: state[action.viewType].currentPage + 1,
      });
      return Object.assign({}, state, updateState);

    case viewPaginationConstants.VIEW_PAGE_NUMBER:
      if (
        !Number.isInteger(action.pageNumber)
        || action.pageNumber < 1
        || action.pageNumber > state[action.viewType].totalPages
      ) {
        return state;
      }

      updateState[action.viewType] = Object.assign({}, state[action.viewType], {
        currentPage: action.pageNumber,
      });
      return Object.assign({}, state, updateState);

    case viewPaginationConstants.SET_PER_PAGE:
      updateState[action.viewType] = Object.assign({}, state[action.viewType], {
        pageSize: action.pageSize,
      });
      return Object.assign({}, state, updateState);

    case helpers.FULFILLED_ACTION(clusterConstants.GET_CLUSTERS):
      updatePageCounts(viewConstants.CLUSTERS_VIEW, action.payload.data.total);
      return Object.assign({}, state, updateState);

    case viewPaginationConstants.VIEW_SET_LIST_FILTER:
      updateState[action.viewType] = Object.assign({}, state[action.viewType], {
        filter: action.filter,
      });
      return Object.assign({}, state, updateState);

    case viewPaginationConstants.VIEW_CHANGE_SORT:
      updateState[action.viewType] = Object.assign({}, state[action.viewType], {
        sorting: action.sorting,
      });
      return Object.assign({}, state, updateState);

    default:
      return state;
  }
};

viewOptionsReducer.initialState = initialState;

export { initialState, viewOptionsReducer };

export default viewOptionsReducer;
