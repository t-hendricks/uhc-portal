import { action, ActionType } from 'typesafe-actions';
import type { ViewFlags, ViewSorting } from '../../types/types';
import { viewPaginationConstants } from '../constants';
import type { AppThunk } from '../types';

const onFirstPageAction = (viewType: string) =>
  action(viewPaginationConstants.VIEW_FIRST_PAGE, { viewType });

const onFirstPage =
  (viewType: string): AppThunk =>
  (dispatch) =>
    dispatch(onFirstPageAction(viewType));

const onLastPageAction = (viewType: string) =>
  action(viewPaginationConstants.VIEW_LAST_PAGE, { viewType });

const onLastPage =
  (viewType: string): AppThunk =>
  (dispatch) =>
    dispatch(onLastPageAction(viewType));

const onPreviousPageAction = (viewType: string) =>
  action(viewPaginationConstants.VIEW_PREVIOUS_PAGE, { viewType });

const onPreviousPage =
  (viewType: string): AppThunk =>
  (dispatch) =>
    dispatch(onPreviousPageAction(viewType));

const onNextPageAction = (viewType: string) =>
  action(viewPaginationConstants.VIEW_NEXT_PAGE, { viewType });

const onNextPage =
  (viewType: string): AppThunk =>
  (dispatch) =>
    dispatch(onNextPageAction(viewType));

const onPageInputAction = (pageNumber: number, viewType: string) =>
  action(viewPaginationConstants.VIEW_PAGE_NUMBER, { viewType, pageNumber });

const onPageInput =
  (pageNumber: number, viewType: string): AppThunk =>
  (dispatch) =>
    dispatch(onPageInputAction(pageNumber, viewType));

const onPerPageSelectAction = (pageSize: number, viewType: string) =>
  action(viewPaginationConstants.SET_PER_PAGE, { viewType, pageSize });

const onPerPageSelect =
  (pageSize: number, viewType: string): AppThunk =>
  (dispatch) =>
    dispatch(onPerPageSelectAction(pageSize, viewType));

const onListFilterSetAction = (filter: string, viewType: string) =>
  action(viewPaginationConstants.VIEW_SET_LIST_FILTER, { viewType, filter });

const onListFilterSet =
  (filter: string, viewType: string): AppThunk =>
  (dispatch) =>
    dispatch(onListFilterSetAction(filter, viewType));

const onListFlagsSetAction = (key: string, value: ViewFlags, viewType: string) =>
  action(viewPaginationConstants.VIEW_SET_LIST_FLAGS, { viewType, key, value });

const onListFlagsSet =
  (key: string, value: ViewFlags, viewType: string): AppThunk =>
  (dispatch) =>
    dispatch(onListFlagsSetAction(key, value, viewType));

const onClearFiltersAndFlagsAction = (viewType: string) =>
  action(viewPaginationConstants.VIEW_CLEAR_FILTERS_AND_FLAGS, { viewType });

const onClearFiltersAndFlags =
  (viewType: string): AppThunk =>
  (dispatch) =>
    dispatch(onClearFiltersAndFlagsAction(viewType));

const onListSortByAction = (sorting: ViewSorting, viewType: string) =>
  action(viewPaginationConstants.VIEW_CHANGE_SORT, { viewType, sorting });

const onListSortBy =
  (sorting: ViewSorting, viewType: string): AppThunk =>
  (dispatch) =>
    dispatch(onListSortByAction(sorting, viewType));

const viewActions = {
  onFirstPage,
  onLastPage,
  onPreviousPage,
  onNextPage,
  onPageInput,
  onPerPageSelect,
  onListFilterSet,
  onListFlagsSet,
  onListSortBy,
  onClearFiltersAndFlags,
};

type ViewOptionsAction = ActionType<
  | typeof onFirstPageAction
  | typeof onLastPageAction
  | typeof onPreviousPageAction
  | typeof onNextPageAction
  | typeof onPageInputAction
  | typeof onPerPageSelectAction
  | typeof onListFilterSetAction
  | typeof onListFlagsSetAction
  | typeof onListSortByAction
  | typeof onClearFiltersAndFlagsAction
>;

export {
  viewActions,
  onFirstPage,
  onLastPage,
  onPreviousPage,
  onNextPage,
  onPageInput,
  onPerPageSelect,
  onListFilterSet,
  onListFlagsSet,
  onListSortBy,
  onClearFiltersAndFlags,
  ViewOptionsAction,
};
