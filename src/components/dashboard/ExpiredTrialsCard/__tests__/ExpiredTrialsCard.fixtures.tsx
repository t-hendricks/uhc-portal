import { expiredTrialsFilter } from '../expiredTrialsHelpers';

export const initialState = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: false,
  valid: false,
  items: [],
};

export const baseViewOptions = {
  currentPage: 1,
  pageSize: 5,
  totalCount: 0,
  totalPages: 0,
  filter: expiredTrialsFilter,
};
