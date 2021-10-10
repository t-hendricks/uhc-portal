import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

const noop = Function.prototype;

const isValid = id => id !== null && id !== undefined && id !== false && id !== '';

const strToCleanArray = str => (str ? str.split(',').map(item => item.trim()).filter(item => item) : undefined);

const multiInputToCleanArray = (formData, fieldName) => {
  const fieldContents = formData[fieldName];
  return (
    fieldContents.map(fieldContent => get(fieldContent, `${fieldName}`, null)).filter(input => input)).map(item => item.trim());
};

/**
 * Parses comma separated key<delimiter>value pairs into an object.
 * @param {*} str Comma separated string of kay:val pairs
 * @param {*} delimiter delimiter to split each pair by
 */
const strToCleanObject = (str, delimiter) => {
  if (!str) {
    return {};
  }
  const pairArray = strToCleanArray(str);
  const pairs = {};
  pairArray.forEach((pairStr) => {
    const [key, val] = pairStr.split(delimiter);
    pairs[key] = val;
  });
  return pairs;
};

/**
 * Generates a random 4B string that can be used as a key.
 */
const getRandomID = () => {
  const id = Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  return `${id}`;
};

const randAlphanumString = length => btoa(Math.random()).substr(5, length);

const omitEmptyFields = (obj) => {
  const objToClean = obj;
  Object.keys(objToClean).forEach((key) => {
    if (objToClean[key] && typeof objToClean[key] === 'object') omitEmptyFields(objToClean[key]);
    else if (!obj[key] && obj[key] !== false) delete objToClean[key];
  });
  return objToClean;
};

const scrollToTop = () => {
  const pageTop = document.getElementById('scrollToTop');
  if (pageTop) {
    pageTop.scrollIntoView();
  }
};

const noQuotaTooltip = 'You do not have enough quota for this option. Contact sales to purchase additional quota.';

const noMachineTypes = 'You do not have enough quota to create a cluster with the minimum required worker capacity. Contact sales to purchase additional quota.';

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

const helpers = {
  noop,
  isValid,
  omitEmptyFields,
  strToCleanArray,
  scrollToTop,
  nestedIsEmpty,
};

const trackPendo = (event, pendoID) => {
  if (window.pendo && window.pendo.isReady && window.pendo.isReady() && window.pendo.track) {
    window.pendo.track(event, {
      type: pendoID || window.location.pathname,
    });
  }
};

const shouldRefetchQuota = (organization) => {
  const lastFetchedQuota = organization.timestamp;
  const now = new Date();
  const TWO_MINUTES = 1000 * 60 * 2;
  return !organization.pending && (!organization.fulfilled || now - lastFetchedQuota > TWO_MINUTES);
};

/**
 * Used for onSubmitFail in Redux Form config.
 */
function scrollToFirstError(errors) {
  const errorNodeNames = Object.keys(errors);
  if (!errorNodeNames.length) {
    return;
  }
  const errorNodes = errorNodeNames.map(name => (
    document.querySelector(`[name^="${name}"`)
  ));
  const compare = (node1, node2) => {
    const result = node1.compareDocumentPosition(node2);
    switch (result) {
      case (Node.DOCUMENT_POSITION_PRECEDING):
        return 1;
      case (Node.DOCUMENT_POSITION_FOLLOWING):
        return -1;
      default:
        return 0;
    }
  };
  let firstError = errorNodes[0];
  if (errorNodes.length > 1) {
    errorNodes.forEach((node) => {
      if (compare(node, firstError) < 0) {
        firstError = node;
      }
    });
  }
  setTimeout(() => firstError.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
}

/**
 * Converts redux form structure to the structure expected by ocm api
 * [{ key: "foo", value: "bar" },{ key: "hello", value: "world" }]
 *   => { foo: "bar", hello: "world" }
 * @param {Array} labelsFormData Array of key value parirs
 */
const parseReduxFormKeyValueList = labelsFormData => Object.assign(
  {},
  ...(labelsFormData.map(label => label.key && label.value
    && ({ [label.key]: label.value }))),
);

/**
 * only return non-empty taints (temporary untill proper fields validation will be implemented)
 * and remove the 'id' property
 * @param {Array} taintsFormData Array of taints. Example:
 * [{ key: 'foo', value: 'bar', effect: 'NoSchedule'},
 * { id: '1a2b3c', key: 'foo1', value: 'bar1', effect: 'NoExecute'},]
 */
const parseReduxFormTaints = taintsFormData => taintsFormData.map(
  taint => ((taint.key && taint.value && taint.effect)
   && { key: taint.key, value: taint.value, effect: taint.effect }),
).filter(Boolean);

// https://pkg.go.dev/time#Time
const goZeroTime = '0001-01-01T00:00:00Z';

/**
 * try to parse the go zero time, and return null for it.
 * it does not exhaust all time formats.
 * the fix is for AMS returning null timestamp in the form of go zerotime.
 * @param {string} timeStr the timestamp string. Example:
 * '2021-10-08T17:11:02Z' returns '2021-10-08T17:11:02Z'
 * '0001-01-01T00:00:00Z' returns null
 */
const goZeroTime2Null = (timeStr) => {
  if (timeStr === goZeroTime) {
    return null;
  }

  const tm = Date.parse(timeStr);
  if (!Number.isNaN(tm) && tm === Date.parse(goZeroTime)) {
    return null;
  }

  return timeStr;
};

export {
  noop,
  isValid,
  omitEmptyFields,
  strToCleanArray,
  multiInputToCleanArray,
  scrollToTop,
  getRandomID,
  randAlphanumString,
  noQuotaTooltip,
  noMachineTypes,
  trackPendo,
  strToCleanObject,
  shouldRefetchQuota,
  scrollToFirstError,
  parseReduxFormKeyValueList,
  parseReduxFormTaints,
  goZeroTime2Null,
};

export default helpers;
