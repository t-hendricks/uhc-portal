import isEmpty from 'lodash/isEmpty';
import semver from 'semver';

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

/**
 * Normalizes the data to make sure it's a list
 * @param itemOrList {Object} item or list of items.
 */
const asArray = <T>(itemOrList: T | T[]): T[] => {
  if (Array.isArray(itemOrList)) {
    return itemOrList;
  }
  return [itemOrList];
};

const stringToArray = (str?: string) => str && str.trim().split(',');
const stringToArrayTrimmed = (str: string) =>
  asArray(stringToArray(str))
    .map((ns) => ns?.trim())
    .filter((ns) => !!ns);

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

const noQuotaTooltip =
  'You do not have enough quota for this option. Contact sales to purchase additional quota.';

const noMachineTypes =
  'You do not have enough quota to create a cluster with the minimum required worker capacity. Contact sales to purchase additional quota.';

const nodeKeyValueTooltipText =
  "To add an additional label, make sure all of your labels' keys are filled out (value fields are optional).";

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
  strToCleanArray,
  asArray,
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
 * Scroll to and focus on the first field found in the record of IDs.
 * @param ids List of element IDs. An ID can be partial.
 * @param focusSelector Used to discover element to focus on, defaults to form elements;
 * input, select, textarea
 * @return true if a field was found to scroll to, false otherwise.
 */
const scrollToFirstField = (ids: string[], focusSelector: string = 'input,select,textarea') => {
  if (!ids?.length) {
    return false;
  }

  // Use all error selectors, where the first matching element in the document is returned.
  const scrollElement = document.querySelector(ids.map((id) => `[id*="${id}"]`).join(','));

  if (scrollElement instanceof HTMLElement) {
    let focusElement: HTMLElement | null = scrollElement;

    // Find the element to focus on if the focusSelector does not include the element to scroll to.
    if (!focusSelector.includes(scrollElement.tagName.toLowerCase())) {
      focusElement = scrollElement?.querySelector(focusSelector);
    }

    // Scroll and focus
    setTimeout(() => scrollElement.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    focusElement?.focus({ preventScroll: true });

    return true;
  }

  return false;
};

/**
 * Converts redux form structure to the structure expected by OCM API.
 * Pairs with missing keys are omitted.
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
      .filter(({ key }) => typeof key !== 'undefined' && key !== '')
      .map(({ key, value }) => [key, value ?? '']),
  );

/**
 * Converts redux form structure to the structure expected by OCM API.
 * Pairs with missing keys are omitted, and the 'id' property is removed
 *
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
        taint.effect && {
          key: taint.key,
          value: taint.value === null || taint.value === undefined ? '' : taint.value,
          effect: taint.effect,
        },
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

/**
 * determine if a version's major.minor level is <= maxMinorVerison's major.minor level.
 * we exclude the patch version of maxMinorVersion here even though ocpVersion can have a patch version.
 * this works because a <=major.minor semver range ignores patch versions, e.g. 4.11.13 satisfies the range <=4.11.
 * @param {string} version version to test (major.minor.patch or major.minor)
 * @param {string} maxMinorVersion version to compare with (major.minor.patch or major.minor)
 */
const isSupportedMinorVersion = (version: string, maxMinorVersion: string) => {
  const parsedMaxMinorVersion = maxMinorVersion ? semver.coerce(maxMinorVersion) : null;
  return parsedMaxMinorVersion
    ? semver.satisfies(
        version,
        `<=${semver.major(parsedMaxMinorVersion)}.${semver.minor(parsedMaxMinorVersion)}`,
      )
    : false;
};

/**
 * render only the major.minor portion of a major.minor.patch version string.
 * @param {string} version
 */
const formatMinorVersion = (version: string) => {
  const parsedVersion = semver.coerce(version);
  return parsedVersion ? `${semver.major(parsedVersion)}.${semver.minor(parsedVersion)}` : version;
};

/**
 * From "key1=value1,key2=value2" returns object { "key1": "value1", "key2": "value2"}.
 *
 * More examples:
 * - strToKeyValueObject('foo', '') is equal to strToKeyValueObject('foo=', undefined)
 * - strToKeyValueObject('foo') results in "{ foo: undefined }"
 *
 * @param {string} input comma-separated list of key=value pairs
 * @param {string} defaultValue used when the value is missing (like input === "foo").
 *
 */
const strToKeyValueObject = (input?: string, defaultValue?: string) => {
  if (input === undefined) {
    return undefined;
  }

  if (!input) {
    return {};
  }

  return input.split(',').reduce((accum, pair) => {
    const [key, value] = pair.split('=');
    return { ...accum, [key]: value ?? defaultValue };
  }, {});
};

export {
  noop,
  isValid,
  strToCleanArray,
  asArray,
  multiInputToCleanArray,
  getRandomID,
  randAlphanumString,
  noQuotaTooltip,
  noMachineTypes,
  nodeKeyValueTooltipText,
  strToCleanObject,
  shouldRefetchQuota,
  scrollToFirstField,
  parseReduxFormKeyValueList,
  parseReduxFormTaints,
  goZeroTime2Null,
  stringToArray,
  arrayToString,
  isSupportedMinorVersion,
  formatMinorVersion,
  strToKeyValueObject,
  stringToArrayTrimmed,
};

export default helpers;
