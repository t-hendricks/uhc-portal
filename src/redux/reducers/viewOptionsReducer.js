import helpers from '../reduxHelpers';
import {
  clustersConstants,
  viewConstants,
  viewPaginationConstants,
} from '../constants';

const INITAL_VIEW_STATE = {
  currentPage: 1,
  pageSize: 50,
  totalCount: 0,
  totalPages: 0,
  filter: '',
  sorting: {
    sortField: 'name',
    isAscending: true,
  },
  flags: {
    showArchived: false,
  },
};

const initialState = {
};

initialState[viewConstants.CLUSTERS_VIEW] = Object.assign(INITAL_VIEW_STATE);
initialState[viewConstants.ARCHIVED_CLUSTERS_VIEW] = Object.assign(INITAL_VIEW_STATE);

const viewOptionsReducer = (state = initialState, action) => {
  const updateState = {};

  const updatePageCounts = (viewType, itemsCount) => {
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
    case viewPaginationConstants.VIEW_FIRST_PAGE:
      updateState[action.viewType] = { ...state[action.viewType], currentPage: 1 };
      return { ...state, ...updateState };

    case viewPaginationConstants.VIEW_LAST_PAGE:
      updateState[action.viewType] = {
        ...state[action.viewType],
        currentPage: state[action.viewType].totalPages,
      };
      return { ...state, ...updateState };

    case viewPaginationConstants.VIEW_PREVIOUS_PAGE:
      if (state[action.viewType].currentPage < 2) {
        return state;
      }

      updateState[action.viewType] = {
        ...state[action.viewType],
        currentPage: state[action.viewType].currentPage - 1,
      };
      return { ...state, ...updateState };

    case viewPaginationConstants.VIEW_NEXT_PAGE:
      if (state[action.viewType].currentPage >= state[action.viewType].totalPages) {
        return state;
      }
      updateState[action.viewType] = {
        ...state[action.viewType],
        currentPage: state[action.viewType].currentPage + 1,
      };
      return { ...state, ...updateState };

    case viewPaginationConstants.VIEW_PAGE_NUMBER:
      if (
        !Number.isInteger(action.pageNumber)
        || action.pageNumber < 1
        || action.pageNumber > state[action.viewType].totalPages
      ) {
        return state;
      }

      updateState[action.viewType] = { ...state[action.viewType], currentPage: action.pageNumber };
      return { ...state, ...updateState };

    case viewPaginationConstants.SET_PER_PAGE:
      updateState[action.viewType] = { ...state[action.viewType], pageSize: action.pageSize };
      return { ...state, ...updateState };

    case helpers.FULFILLED_ACTION(clustersConstants.GET_CLUSTERS):
      updatePageCounts(viewConstants.CLUSTERS_VIEW, action.payload.data.total);
      updatePageCounts(viewConstants.ARCHIVED_CLUSTERS_VIEW, action.payload.data.total);
      return { ...state, ...updateState };

    case viewPaginationConstants.VIEW_SET_LIST_FILTER:
      updateState[action.viewType] = {
        ...state[action.viewType],
        filter: action.filter,
        currentPage: 1,
      };
      return { ...state, ...updateState };

    case viewPaginationConstants.VIEW_CHANGE_SORT:
      updateState[action.viewType] = { ...state[action.viewType], sorting: action.sorting };
      return { ...state, ...updateState };

    case viewPaginationConstants.VIEW_SET_LIST_FLAGS:
      updateState[action.viewType] = {
        ...state[action.viewType],
        flags: {
          ...state[action.viewType].flags,
          [action.key]: action.value,
        },
      };
      return { ...state, ...updateState };

    default:
      return state;
  }
};

viewOptionsReducer.initialState = initialState;

export { initialState, viewOptionsReducer };

export default viewOptionsReducer;
