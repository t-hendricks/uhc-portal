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
        // Note that this is buggy if the user ever sets a cluster to have an empty display name
        // https://jira.coreos.com/browse/SDA-274
        queryObject.order = `display_name ${direction}, name ${direction}`;
      } else {
        queryObject.order = `${viewOptions.sorting.sortField} ${direction}`;
      }
    }
    /* HACK: the backend defers all search query complexity to the UI. This means we have to escape
    singlequotes, otherwise users will get an error they won't understand if
    they accidentally type a singlequote. It also means that the query we send to the backend is
    extremely complicated - it tries to search by display_name, because that's the name shown
    to the user, but for clusters without display_name we show 'name'
    so we search by name if display_name is empty.
    */
    const escaped = viewOptions.filter ? viewOptions.filter.replace(/(')/g, '\'\'') : '';
    queryObject.filter = viewOptions.filter ? `display_name like '%${escaped}%' or (display_name = '' and name like '%${escaped}%') or external_id like '%${escaped}%'` : undefined;
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

const isValid = id => id !== null && id !== undefined && id !== false && id !== '';

const INVALIDATE_ACTION = base => `${base}_INVALIDATE`;

// redux-middleware-promise
const FULFILLED_ACTION = base => `${base}_FULFILLED`;
const PENDING_ACTION = base => `${base}_PENDING`;
const REJECTED_ACTION = base => `${base}_REJECTED`;

const toCleanArray = str => str.split(',').map(item => item.trim()).filter(item => item);


const omitEmptyFields = (obj) => {
  const objToClean = obj;
  Object.keys(objToClean).forEach((key) => {
    if (objToClean[key] && typeof objToClean[key] === 'object') omitEmptyFields(objToClean[key]);
    else if (!obj[key] && obj[key] !== false) delete objToClean[key];
  });
  return objToClean;
};

const helpers = {
  noop,
  setStateProp,
  viewPropsChanged,
  createViewQueryObject,
  getErrorMessage,
  getMetricsTimeDelta,
  isValid,
  omitEmptyFields,
  toCleanArray,
  INVALIDATE_ACTION,
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
};

export {
  noop, getMetricsTimeDelta, isValid, omitEmptyFields, toCleanArray,
};

export default helpers;
