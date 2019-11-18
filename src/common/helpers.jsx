import React from 'react';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

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
    || !isEqual(nextViewOptions.flags, currentViewOptions.flags)
);

// The backend accepts queries in https://github.com/yaacov/tree-search-language syntax,
// which is effectively a subset of SQL.
// This requires the UI to construct the syntax correctly (e.g. escape singlequotes).
// It also means that the query we send to the backend is quite complicated.

const sqlString = (s) => {
  // escape ' characters by doubling
  const escaped = s.replace(/'/g, "''");
  return `'${escaped}'`;
};

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
        queryObject.order = `display_name ${direction}`;
      } else {
        queryObject.order = `${viewOptions.sorting.sortField} ${direction}`;
      }
    }

    const clauses = []; // will be joined with AND

    // base filter: filter out clusters without IDs
    clauses.push("cluster_id!=''");

    // handle archived flag
    if (viewOptions.flags.showArchived) {
      clauses.push("status='Archived'");
    } else {
      clauses.push("status NOT IN ('Deprovisioned', 'Archived')");
    }

    // If we got a search string from the user, format it as a LIKE query.
    if (viewOptions.filter) {
      const likePattern = `%${viewOptions.filter}%`;
      clauses.push(`display_name ILIKE ${sqlString(likePattern)} OR external_cluster_id ILIKE ${sqlString(likePattern)}`);
    }

    if (!isEmpty(viewOptions.flags.subscriptionFilter)) {
      // We got flags for filtering according to specific subscription properties
      // subscriptionFilter is an object in the form of { key: ["possible", "values"] }
      Object.keys(viewOptions.flags.subscriptionFilter).forEach((field) => {
        const items = viewOptions.flags.subscriptionFilter[field];
        if (!isEmpty(items)) {
          // convert each list of selected filter values to a SQL-like clause
          const quotedItems = viewOptions.flags.subscriptionFilter[field].map(sqlString);
          clauses.push(`${field} IN (${quotedItems.join(',')})`);
        }
      });
    }

    queryObject.filter = clauses.map(c => `(${c})`).join(' AND ').trim();
  }

  return queryObject;
};

function overrideErrorMessage(payload) {
  if (!payload) {
    return '';
  }

  let message = '';

  // override error by its kind
  const errorKind = get(payload, 'details[0].kind', '');
  switch (errorKind) {
    case 'ExcessResources':
      message = `You are not authorized to create the cluster because your request exceeds available quota.
              In order to fulfill this request, you will need quota/subscriptions for:`;
      break;
    default:
  }

  // override error by its code
  const errorCode = get(payload, 'code', '');
  switch (errorCode) {
    case 'ACCT-MGMT-22': // ErrorBanned
      message = (
        <span>
          Your account has been placed on
          {' '}
          <a href="https://access.redhat.com/articles/1340183" target="_blank">Export Hold</a>
          {' '}
          based on export control screening.
          <br />
          The Export Compliance Team has been notified that your account is on hold,
          {' '}
          and must conduct additional due diligence to resolve the Export Hold.
          <br />
          Try again in 24-48 hours.
        </span>
      );
      break;
    default:
  }

  return message;
}

function getErrorMessage(payload) {
  if (payload.response === undefined) {
    // Handle edge cases in which `payload` might be an Error type
    return String(payload);
  }

  const response = payload.response.data;

  // Determine if error needs to be overridden
  const message = overrideErrorMessage(response);
  if (message) {
    return message;
  }


  // CMS uses "kind" for the error object, but AMS uses 'type'
  if (response !== undefined && (response.kind === 'Error' || response.type === 'Error')) {
    return `${response.code}:\n${response.reason}`;
  }

  return JSON.stringify(response);
}

// getErrorState returns the standard error state for a rejected redux action
const getErrorState = action => ({
  pending: false,
  error: action.error,
  errorCode: get(action.payload, 'response.status'),
  internalErrorCode: get(action.payload, 'response.data.code'),
  errorMessage: getErrorMessage(action.payload),
  errorDetails: get(action.payload, 'response.data.details'),
  operationID: get(action.payload, 'response.data.operation_id'),
});

// returns the time delta in hours between two date objects
function getTimeDelta(t1, t2 = new Date()) {
  const timeDiff = Math.abs(t2.getTime() - t1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600));
}

const isValid = id => id !== null && id !== undefined && id !== false && id !== '';

const INVALIDATE_ACTION = base => `${base}_INVALIDATE`;

// redux-middleware-promise
const FULFILLED_ACTION = base => `${base}_FULFILLED`;
const PENDING_ACTION = base => `${base}_PENDING`;
const REJECTED_ACTION = base => `${base}_REJECTED`;

const toCleanArray = str => (str ? str.split(',').map(item => item.trim()).filter(item => item) : undefined);

const omitEmptyFields = (obj) => {
  const objToClean = obj;
  Object.keys(objToClean).forEach((key) => {
    if (objToClean[key] && typeof objToClean[key] === 'object') omitEmptyFields(objToClean[key]);
    else if (!obj[key] && obj[key] !== false) delete objToClean[key];
  });
  return objToClean;
};


const scrollToTop = () => {
  const pageTop = document.querySelector('section.pf-c-page__main-section');
  if (pageTop) {
    pageTop.scrollIntoView();
  }
};

const buildUrlParams = params => Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');

/**
 * Create URL params for the cluster list filter.
 * The resulting filters are not escaped, comma separated, and empty arrays are omitted.
 *
* For example:
 * ```
 * buildFilterURLParams({ a: ['a', 'b'], c: [], d: ['e'] }) = 'a=a,b&d=e'
 * ```
 * @param {Object} params
 */
const buildFilterURLParams = params => Object.keys(params).map(
  key => (!isEmpty(params[key]) && `${key}=${params[key].join(',')}`),
).filter(Boolean).join('&');

/**
 * Returns true if an object is empty or if all its direct children are empty.
 *
 * For example:
 * ```
 * nestedIsEmpty({}) = true
 * nestedIsEmpty({a: []}) = true
 * nestedIsEmpty({a: [], b: ['a']}) = false
 * ```
 * @param {Object} obj
 */
const nestedIsEmpty = obj => (isEmpty(obj) || Object.keys(obj).map(
  key => isEmpty(obj[key]),
).every(item => item));

/**
 * Returns a countdown object, containing the number of days, hours and minutes
 * left from now until the time specified in the timestamp.
 *
 * @param {*} timeString A string value representing a date, specified in a
 *                      format recognized by the Date.parse() method
 */
const getCountdown = (timeString) => {
  const MS_PER_MINUTE = 1000 * 60;
  const MS_PER_HOUR = MS_PER_MINUTE * 60;
  const MS_PER_DAY = MS_PER_HOUR * 24;

  const expirationTime = new Date(timeString);
  const now = new Date();
  // Converting the dates to UTC to condider DST and other oddities...
  const nowUTC = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const expUTC = Date.UTC(
    expirationTime.getFullYear(),
    expirationTime.getMonth(),
    expirationTime.getDate(),
  );
  const msUntilExp = expUTC - nowUTC;

  const countdown = {
    days: Math.floor(msUntilExp / MS_PER_DAY),
    hours: Math.floor(msUntilExp / MS_PER_HOUR) % 24,
    minutes: Math.floor(msUntilExp / MS_PER_MINUTE) % 60,
  };

  return countdown;
};

const helpers = {
  noop,
  setStateProp,
  viewPropsChanged,
  sqlString,
  createViewQueryObject,
  getErrorMessage,
  getErrorState,
  getTimeDelta,
  isValid,
  omitEmptyFields,
  toCleanArray,
  scrollToTop,
  buildUrlParams,
  buildFilterURLParams,
  nestedIsEmpty,
  INVALIDATE_ACTION,
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
};

export {
  noop,
  getTimeDelta,
  isValid,
  omitEmptyFields,
  toCleanArray,
  scrollToTop,
  buildUrlParams,
  getCountdown,
};

export default helpers;
