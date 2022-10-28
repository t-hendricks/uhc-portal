import isEmpty from 'lodash/isEmpty';

const noop = Function.prototype;

const isValid = (id?: string | boolean): boolean =>
  id !== null && id !== undefined && id !== false && id !== '';

const strToCleanArray = (str?: string): string[] | undefined =>
  str
    ? str
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item)
    : undefined;

const multiInputToCleanArray = (
  formData: { [name: string]: string | { [name: string]: string | null }[] },
  fieldName: string,
): string[] => {
  const fieldContents = formData[fieldName];
  return Array.isArray(fieldContents)
    ? fieldContents
        .map((fieldContent) => fieldContent?.[fieldName])
        .filter((input) => input)
        .map((item) => item!.trim())
    : [];
};

const stringToArray = (str?: string) => str && str.trim().split(',');

const arrayToString = (arr?: string[]) => arr && arr.join(',');

/**
 * Parses comma separated key<delimiter>value pairs into an object.
 * @param {*} str Comma separated string of kay:val pairs
 * @param {*} delimiter delimiter to split each pair by
 */
const strToCleanObject = (str: string, delimiter: string): { [k: string]: string } => {
  if (!str) {
    return {};
  }
  const pairArray = strToCleanArray(str);
  const pairs: { [k: string]: string } = {};
  pairArray?.forEach((pairStr) => {
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

const randAlphanumString = (length: number): string =>
  btoa(String(Math.random())).substr(5, length);

const scrollToTop = () => {
  const pageTop = document.getElementById('scrollToTop');
  if (pageTop) {
    pageTop.scrollIntoView();
  }
};

const noQuotaTooltip =
  'You do not have enough quota for this option. Contact sales to purchase additional quota.';

const noMachineTypes =
  'You do not have enough quota to create a cluster with the minimum required worker capacity. Contact sales to purchase additional quota.';

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
const nestedIsEmpty = (obj: { [k: string]: unknown[] }): boolean =>
  isEmpty(obj) ||
  Object.keys(obj)
    .map((key) => isEmpty(obj[key]))
    .every((item) => item);

const helpers = {
  noop,
  isValid,
  // omitEmptyFields,
  strToCleanArray,
  scrollToTop,
  nestedIsEmpty,
};

// TODO correct type once reducers have migrated to typescript
const shouldRefetchQuota = (organization: any) => {
  const lastFetchedQuota = organization.timestamp;
  const now = new Date().getTime();
  const TWO_MINUTES = 1000 * 60 * 2;
  return !organization.pending && (!organization.fulfilled || now - lastFetchedQuota > TWO_MINUTES);
};

/**
 * Scroll to and focus on the first error found in the record of errors.
 * @param errors Record of errors
 * @param focusSelector Used to discover element to focus on, defaults to form elements;
 * input, select, textarea
 */
const scrollToFirstError = (
  errors: Record<string, string>,
  focusSelector = 'input,select,textarea',
) => {
  const errorIds = Object.keys(errors);

  if (!errorIds?.length) {
    return;
  }

  // Use all error selectors, where the first matching element in the document is returned.
  const scrollElement = document.querySelector(errorIds.map((id) => `[id*="${id}"]`).join(','));

  if (scrollElement instanceof HTMLElement) {
    let focusElement: HTMLElement | null = scrollElement;

    // Find the element to focus on if the focusSelector does not include the element to scroll to.
    if (!focusSelector.includes(scrollElement.tagName.toLowerCase())) {
      focusElement = scrollElement?.querySelector(focusSelector);
    }

    // Scroll and focus
    setTimeout(() => scrollElement.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    focusElement?.focus({ preventScroll: true });
  }
};

/**
 * Converts redux form structure to the structure expected by OCM API.
 * pairs with missing keys are omitted.
 *
 * @example
 * parseReduxFormKeyValueList([
 *  { key: "foo", value: "bar" },
 *  { key: "hello", value: "world" },
 *  { key: undefined, value: "wat" },
 * ]) // => { foo: "bar", hello: "world" }
 * @param {Array} [labelsFormData=[{}]] Array of key value pairs
 */
const parseReduxFormKeyValueList = (
  labelsFormData: { key: string | undefined; value: string | undefined }[] = [{}] as {
    key: string;
    value: string;
  }[],
): {
  [k: string]: string;
} =>
  Object.fromEntries(
    labelsFormData
      .filter(({ key }) => typeof key !== 'undefined')
      .map(({ key, value }) => [key, value ?? '']),
  );

/**
 * only return non-empty taints (temporary untill proper fields validation will be implemented)
 * and remove the 'id' property
 * @param {Array} taintsFormData Array of taints. Example:
 * [{ key: 'foo', value: 'bar', effect: 'NoSchedule'},
 * { id: '1a2b3c', key: 'foo1', value: 'bar1', effect: 'NoExecute'},]
 */
const parseReduxFormTaints = (
  taintsFormData: { key?: string; value?: string; effect?: string; id?: string }[],
) =>
  taintsFormData
    .map(
      (taint) =>
        taint.key &&
        taint.value &&
        taint.effect && { key: taint.key, value: taint.value, effect: taint.effect },
    )
    .filter(Boolean);

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
const goZeroTime2Null = (timeStr: string): string | null => {
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
  // omitEmptyFields,
  strToCleanArray,
  multiInputToCleanArray,
  scrollToTop,
  getRandomID,
  randAlphanumString,
  noQuotaTooltip,
  noMachineTypes,
  strToCleanObject,
  shouldRefetchQuota,
  scrollToFirstError,
  parseReduxFormKeyValueList,
  parseReduxFormTaints,
  goZeroTime2Null,
  stringToArray,
  arrayToString,
};

export default helpers;
