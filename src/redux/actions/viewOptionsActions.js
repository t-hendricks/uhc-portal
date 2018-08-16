import { viewPaginationConstants } from '../constants';

const onFirstPage = viewType => dispatch => dispatch({
  type: viewPaginationConstants.VIEW_FIRST_PAGE,
  viewType,
});

const onLastPage = viewType => dispatch => dispatch({
  type: viewPaginationConstants.VIEW_LAST_PAGE,
  viewType,
});

const onPreviousPage = viewType => dispatch => dispatch({
  type: viewPaginationConstants.VIEW_PREVIOUS_PAGE,
  viewType,
});

const onNextPage = viewType => dispatch => dispatch({
  type: viewPaginationConstants.VIEW_NEXT_PAGE,
  viewType,
});

const onPageInput = (pageIndex, viewType) => dispatch => dispatch({
  type: viewPaginationConstants.VIEW_PAGE_NUMBER,
  viewType,
  pageNumber: pageIndex,
});

const onPerPageSelect = (size, viewType) => dispatch => dispatch({
  type: viewPaginationConstants.SET_PER_PAGE,
  viewType,
  pageSize: size,
});

const viewActions = {
  onFirstPage,
  onLastPage,
  onPreviousPage,
  onNextPage,
  onPageInput,
  onPerPageSelect,
};

export {
  viewActions, onFirstPage, onLastPage, onPreviousPage, onNextPage, onPageInput, onPerPageSelect,
};
