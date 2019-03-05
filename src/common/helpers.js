import isEqual from 'lodash/isEqual';

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
    || !isEqual(nextViewOptions.sorting, currentViewOptions.sorting)
    || !isEqual(nextViewOptions.filter, currentViewOptions.filter)
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
      if (viewOptions.sorting.sortField === 'name') {
        // special casing name sorting, should sort by display name first, name second
        queryObject.order = `display_name ${direction}, name ${direction}`;
      } else {
        queryObject.order = `${viewOptions.sorting.sortField} ${direction}`;
      }
    }
    queryObject.filter = viewOptions.filter ? `display_name like '%${viewOptions.filter}%' or (display_name = '' and name like '%${viewOptions.filter}%') or external_id like '%${viewOptions.filter}%'` : undefined;
  }

  return queryObject;
};

function getErrorMessage(payload) {
  if (payload.response === undefined) {
    // Handle edge cases in which `payload` might be an Error type
    return String(payload);
  }
  const response = payload.response.data;
  if (response !== undefined && response.kind === 'Error') {
    return `${response.code}:\n${response.reason}`;
  }
  return JSON.stringify(response);
}

function getMetricsTimeDelta(t1, t2 = new Date()) {
  const timeDiff = Math.abs(t2.getTime() - t1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600));
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
  getMetricsTimeDelta,
  INVALIDATE_ACTION,
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
};

export { noop, getMetricsTimeDelta };

export default helpers;
