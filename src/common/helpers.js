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

const noQuotaTooltip = 'You do not have quota for this option. Contact sales to purchase additional quota.';

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


const trackPendo = (event, cloudProviderID) => {
  if (window.pendo && window.pendo.isReady()) {
    window.pendo.track(event, {
      type: cloudProviderID,
    });
  }
};

export {
  noop,
  isValid,
  omitEmptyFields,
  strToCleanArray,
  multiInputToCleanArray,
  scrollToTop,
  getRandomID,
  noQuotaTooltip,
  trackPendo,
  strToCleanObject,
};

export default helpers;
