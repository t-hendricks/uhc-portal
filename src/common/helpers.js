import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { tools } from './installLinks.mjs';

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

export const ocmResourceType = {
  ALL: 'all',
  // OpenShift Local
  CRC: 'crc',
  // OpenShift on AWS aka ROSA
  MOA: 'moa',
  // OpenShift Container Platform (Self-managed)
  OCP: 'ocp',
  // OpenShift Assisted Installer
  OCP_ASSISTED_INSTALL: 'ocp-assistedinstall',
  // OpenShift Dedicated
  OSD: 'osd',
  // OpenShift Dedicated Trial
  OSDTRIAL: 'osdtrial',
};

const eventNames = {
  FILE_DOWNLOADED: 'File Downloaded',
  BUTTON_CLICKED: 'Button Clicked',
  LINK_CLICKED: 'Link Clicked',
};

const trackEvents = {
  [tools.OC]: {
    deprecated_name: 'OCP-Download-CLITools',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'ocp-cli',
    ocm_resource_type: ocmResourceType.ALL,
  },
  [tools.BUTANE]: {
    deprecated_name: 'Download-BUTANE-CLI',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'butane-cli',
    ocm_resource_type: ocmResourceType.ALL,
  },
  [tools.COREOS_INSTALLER]: {
    deprecated_name: 'Download-CoreOSInstaller-CLI',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'coreosinstaller-cli',
    ocm_resource_type: ocmResourceType.OCP,
  },
  [tools.CRC]: {
    deprecated_name: 'OCP-Download-CRC',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'crc',
    ocm_resource_type: ocmResourceType.CRC,
  },
  [tools.HELM]: {
    deprecated_name: 'Download-HELM-CLI',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'helm-cli',
    ocm_resource_type: ocmResourceType.ALL,
  },
  [tools.X86INSTALLER]: {
    deprecated_name: 'OCP-Download-X86Installer',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'ocp-installer-x86',
    ocm_resource_type: ocmResourceType.OCP,
  },
  [tools.IBMZINSTALLER]: {
    deprecated_name: 'OCP-Download-IBMZInstaller',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'ocp-installer-ibmz',
    ocm_resource_type: ocmResourceType.OCP,
  },
  [tools.PPCINSTALLER]: {
    deprecated_name: 'OCP-Download-PPCInstaller',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'ocp-installer-ppc',
    ocm_resource_type: ocmResourceType.OCP,
  },
  [tools.ARMINSTALLER]: {
    deprecated_name: 'OCP-Download-ARMInstaller',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'ocp-installer-arm',
    ocm_resource_type: ocmResourceType.OCP,
  },
  [tools.KN]: {
    deprecated_name: 'Download-KN-CLI',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'kn-cli',
    ocm_resource_type: ocmResourceType.ALL,
  },
  [tools.OCM]: {
    deprecated_name: 'Download-OCM-CLI',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'ocm-cli',
    ocm_resource_type: ocmResourceType.ALL,
  },
  [tools.ODO]: {
    deprecated_name: 'Download-ODO-CLI',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'odo-cli',
    ocm_resource_type: ocmResourceType.ALL,
  },
  [tools.OPERATOR_SDK]: {
    deprecated_name: 'Download-OSDK-CLI',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'osdk-cli',
    ocm_resource_type: ocmResourceType.ALL,
  },
  [tools.OPM]: {
    deprecated_name: 'Download-OPM-CLI',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'opm-cli',
    ocm_resource_type: ocmResourceType.ALL,
  },
  [tools.RHOAS]: {
    deprecated_name: 'Download-RHOAS-CLI',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'rhoas-cli',
    ocm_resource_type: ocmResourceType.ALL,
  },
  [tools.ROSA]: {
    deprecated_name: 'Download-ROSA-CLI',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'rosa-cli',
    ocm_resource_type: ocmResourceType.MOA,
  },
  [tools.MIRROR_REGISTRY]: {
    deprecated_name: 'Download-Mirror-Registry',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'mirror-registry',
    ocm_resource_type: ocmResourceType.OCP,
  },
  OcpInstallDocumentation: {
    deprecated_name: 'OCP-Download-OfficialDocumentation',
    event: eventNames.LINK_CLICKED,
    link_name: 'ocp-install-documentation',
    ocm_resource_type: ocmResourceType.OCP,
  },
  CrcInstallDocumentation: {
    deprecated_name: 'OCP-Download-OfficialDocumentation',
    event: eventNames.LINK_CLICKED,
    link_name: 'crc-documentation',
    ocm_resource_type: ocmResourceType.CRC,
  },
  CopyPullSecret: {
    deprecated_name: 'OCP-Copy-PullSecret',
    event: eventNames.BUTTON_CLICKED,
    link_name: 'pull-secret',
    ocm_resource_type: ocmResourceType.ALL,
  },
  DownloadPullSecret: {
    deprecated_name: 'OCP-Copy-PullSecret',
    event: eventNames.FILE_DOWNLOADED,
    link_name: 'pull-secret',
    ocm_resource_type: ocmResourceType.ALL,
  },
  RefreshArns: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'refresh-arns',
    ocm_resource_type: ocmResourceType.MOA,
  },
  AssociateAws: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'associate-aws',
    ocm_resource_type: ocmResourceType.MOA,
  },
  RosaLogin: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'copy-rosa-login',
    ocm_resource_type: ocmResourceType.MOA,
  },
  CopyOcmRoleCreateBasic: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'copy-ocm-role-create-basic',
    ocm_resource_type: ocmResourceType.MOA,
  },
  CopyOcmRoleCreateAdmin: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'copy-ocm-role-create-admin',
    ocm_resource_type: ocmResourceType.MOA,
  },
  CopyOcmRoleLink: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'copy-ocm-role-link',
    ocm_resource_type: ocmResourceType.MOA,
  },
  CopyUserRoleCreate: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'copy-user-role-create',
    ocm_resource_type: ocmResourceType.MOA,
  },
  CopyUserRoleLink: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'copy-user-role-link',
    ocm_resource_type: ocmResourceType.MOA,
  },
  CopyUserRoleList: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'copy-user-role-list',
    ocm_resource_type: ocmResourceType.MOA,
  },
  WizardNext: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'wizard-next',
  },
  WizardEnd: {
    event: eventNames.BUTTON_CLICKED,
    link_name: 'wizard-submit',
  },
};

const trackEventsKeys = Object.keys(trackEvents).reduce(
  (accumulator, value) => ({ ...accumulator, [value]: value }), {},
);

/**
 * OCM track events, see https://docs.google.com/spreadsheets/d/1C_WJWPy3sgE2ICaYHgWpWngj0A3Z3zl5GcstWySG9WE
 *
 * @param {String} key The object key to return metadata for
 * @param {String} url Link URL
 * @param {String} path The current path of where the action was performed
 * @param {String} resourceType The resource type, for allowed values see ocmResourceType
 * @param {Object} customProperties A JSON-serializable object for any custom event data
 *
 * @returns {Object} Object {[event]: string, [properties]: Object}
 */
const getTrackEvent = (
  key,
  url,
  path = window.location.pathname,
  resourceType = trackEvents[key]?.ocm_resource_type ?? ocmResourceType.ALL,
  customProperties = {},
) => {
  if (!(key in trackEvents)) {
    return {
      event: null,
      properties: {},
    };
  }
  return {
    event: trackEvents[key].event,
    properties: {
      link_name: trackEvents[key].link_name,
      ...(url && { link_url: url }),
      current_path: path,
      ocm_resource_type: resourceType,
      ...customProperties,
    },
  };
};

const shouldRefetchQuota = (organization) => {
  const lastFetchedQuota = organization.timestamp;
  const now = new Date();
  const TWO_MINUTES = 1000 * 60 * 2;
  return !organization.pending && (!organization.fulfilled || now - lastFetchedQuota > TWO_MINUTES);
};

/**
 * Scroll to the first error found in formErrors.
 * @param {Object} formErrors { [key: fieldName]: string }
 */
const scrollToFirstError = (formErrors) => {
  const errorFieldNames = Object.keys(formErrors);

  if (!errorFieldNames?.length) {
    return;
  }

  // Use all error field selectors, where the first matching element in the document is returned.
  const input = document.querySelector(
    errorFieldNames.map(fieldName => `[name*="${fieldName}"]`).join(','),
  );

  input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  input?.focus();
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
const parseReduxFormKeyValueList = (labelsFormData = [{}]) => Object.fromEntries(
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
  strToCleanObject,
  shouldRefetchQuota,
  scrollToFirstError,
  parseReduxFormKeyValueList,
  parseReduxFormTaints,
  goZeroTime2Null,
  eventNames,
  getTrackEvent,
  trackEventsKeys,
};

export default helpers;
