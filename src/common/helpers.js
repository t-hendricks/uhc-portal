import * as _ from 'lodash-es';

const noop = Function.prototype;

const setStateProp = (prop, data, options) => {
  const { state = {}, initialState = {}, reset = true } = options;
  const obj = { ...state };

  if (!state[prop]) {
    console.error(`Error: Property ${prop} does not exist within the passed state.`, state);
  }

  if (reset && !initialState[prop]) {
    console.warn(`Warning: Property ${prop} does not exist within the passed initialState.`, initialState);
  }

  if (reset) {
    obj[prop] = {
      ...state[prop],
      ...initialState[prop],
      ...data,
    };
  } else {
    obj[prop] = {
      ...state[prop],
      ...data,
    };
  }

  return obj;
};

const viewPropsChanged = (nextViewOptions, currentViewOptions) => (
  nextViewOptions.currentPage !== currentViewOptions.currentPage
    || nextViewOptions.pageSize !== currentViewOptions.pageSize
    || !_.isEqual(nextViewOptions.sorting, currentViewOptions.sorting)
    || !_.isEqual(nextViewOptions.filter, currentViewOptions.filter)
);

const createViewQueryObject = (viewOptions, queryObj) => {
  const queryObject = {
    ...queryObj,
  };

  if (viewOptions) {
    queryObject.page = viewOptions.currentPage;
    queryObject.page_size = viewOptions.pageSize;
    if (viewOptions.sorting.sortField !== null) {
      const direction = viewOptions.sorting.isAscending ? 'asc' : 'desc';
      queryObject.order = `${viewOptions.sorting.sortField} ${direction}`;
    }
    queryObject.filter = viewOptions.filter;
  }

  return queryObject;
};

function getErrorMessage(payload) {
  const response = payload.response.data;
  if (response.kind === 'Error') {
    return `${response.code}:\n${response.reason}`;
  }
  return JSON.stringify(response);
}

const INVALIDATE_ACTION = base => `${base}_INVALIDATE`;

// redux-middleware-promise
const FULFILLED_ACTION = base => `${base}_FULFILLED`;
const PENDING_ACTION = base => `${base}_PENDING`;
const REJECTED_ACTION = base => `${base}_REJECTED`;

const helpers = {
  noop,
  setStateProp,
  viewPropsChanged,
  createViewQueryObject,
  getErrorMessage,
  INVALIDATE_ACTION,
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
};

export default helpers;
