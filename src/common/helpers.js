import isEmpty from 'lodash/isEmpty';

const noop = Function.prototype;

// returns the time delta in hours between two date objects
function getTimeDelta(t1, t2 = new Date()) {
  const timeDiff = Math.abs(t2.getTime() - t1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600));
}

const isValid = id => id !== null && id !== undefined && id !== false && id !== '';

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
  getTimeDelta,
  isValid,
  omitEmptyFields,
  toCleanArray,
  scrollToTop,
  nestedIsEmpty,
};

export {
  noop,
  getTimeDelta,
  isValid,
  omitEmptyFields,
  toCleanArray,
  scrollToTop,
};

export default helpers;
