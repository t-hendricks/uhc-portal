import get from 'lodash/get';

// Valid RFC-1035 labels must consist of lower case alphanumeric characters or '-', start with an
// alphabetic character, and end with an alphanumeric character (e.g. 'my-name',  or 'abc-123').
const DNS_LABEL_REGEXP = /^[a-z]([-a-z0-9]*[a-z0-9])?$/;

// Regular expression used to check base DNS domains, based on RFC-1035
const BASE_DOMAIN_REGEXP = /^([a-z]([-a-z0-9]*[a-z0-9])?\.)+[a-z]([-a-z0-9]*[a-z0-9])?$/;

// Regular expression used to check UUID as specified in RFC4122.
const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Regular expression used to check whether input is a valid IPv4 CIDR range
const CIDR_REGEXP = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/(3[0-2]|[1-2][0-9]|[0-9]))$/;
const MACHINE_CIDR_MAX_SINGLE_AZ = 23;
const MACHINE_CIDR_MAX_MULTI_AZ = 23;
const SERVICE_CIDR_MAX = 24;
const POD_CIDR_MAX = 18;

// Regular expression used to check whether input is a valid IPv4 subnet prefix length
const HOST_PREFIX_REGEXP = /^\/?(3[0-2]|[1-2][0-9]|[0-9])$/;
const HOST_PREFIX_MIN = 23;
const HOST_PREFIX_MAX = 26;

// Regular expression for a valid URL for a console in a self managed cluster.
const CONSOLE_URL_REGEXP = /^https?:\/\/(([0-9]{1,3}\.){3}[0-9]{1,3}|([a-z0-9-]+\.)+[a-z]{2,})(:[0-9]+)?([a-z0-9_/-]+)?$/i;

// Maximum length for a cluster name
const MAX_CLUSTER_NAME_LENGTH = 50;

// Maximum length of a cluster display name
const MAX_CLUSTER_DISPLAY_NAME_LENGTH = 63;

// Maximum node count
const MAX_NODE_COUNT = 180;

const AWS_ARN_REGEX = /^arn:aws:iam::\d{12}:(user|group)\/\S+/;

// Function to validate that a field is mandatory:
const required = value => (value ? undefined : 'Field is required');

// Function to validate that the identity provider name field doesn't include whitespaces:
const checkIdentityProviderName = (value) => {
  if (!value) {
    return 'Name is required.';
  }
  if (/\s/.test(value)) {
    return 'Name must not contain whitespaces.';
  }
  if (/[^A-Za-z0-9_-]/.test(value)) {
    return 'Name should contain only alphanumeric and dashes';
  }
  return undefined;
};

// Function to validate that the issuer field uses https scheme:
const checkOpenIDIssuer = (value) => {
  if (!value) {
    return 'Issuer URL is required.';
  }
  if (!value.startsWith('https://')) {
    return 'Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)';
  }
  let url;
  try {
    url = new URL(value);
  } catch (error) {
    return 'Invalid URL';
  }
  if (url.hash !== '' || url.search !== '') {
    return 'The URL must not include a query string (?) or fragment (#)';
  }
  return undefined;
};


// Function to validate that the cluster name field contains a valid DNS label:
const checkClusterName = (value) => {
  if (!value) {
    return 'Cluster name is required.';
  }
  if (!DNS_LABEL_REGEXP.test(value)) {
    return `Cluster name '${value}' isn't valid, must consist of lower-case alphanumeric characters or '-', start with an alphabetic character, and end with an alphanumeric character. For example, 'my-name', or 'abc-123'.`;
  }
  if (value.length > MAX_CLUSTER_NAME_LENGTH) {
    return `Cluster names may not exceed ${MAX_CLUSTER_NAME_LENGTH} characters.`;
  }
  return undefined;
};

// Function to validate that the github team is formatted: <org/team>
const checkGithubTeams = (value) => {
  if (!value) {
    return undefined;
  }
  const teams = value.split(',');

  for (let i = 0; i < teams.length; i += 1) {
    const team = teams[i];
    const orgTeam = team.split('/');

    if (orgTeam.length !== 2) {
      return "Each team must be of format 'org/team'.";
    }

    if (!orgTeam[0] || !orgTeam[1]) {
      return "Each team must be of format 'org/team'.";
    }

    if (/\s/.test(orgTeam[0])) {
      return 'Organization must not contain whitespaces.';
    }

    if (/\s/.test(orgTeam[1])) {
      return 'Team must not contain whitespaces.';
    }
  }

  return undefined;
};

const checkRouteSelectors = (value) => {
  if (!value) {
    return undefined;
  }
  const selectors = value.split(',');

  for (let i = 0; i < selectors.length; i += 1) {
    const selector = selectors[i];
    const labelValue = selector.split('=');

    if (labelValue.length !== 2) {
      return "Each route selector must be of format 'key=value'.";
    }

    if (!labelValue[0] || !labelValue[1]) {
      return "Each route selector must be of format 'key=value'.";
    }
  }
  return undefined;
};

// Function to validate that the cluster ID field is a UUID:
const checkClusterUUID = (value) => {
  if (!value) {
    return 'Cluster ID is required.';
  }
  if (!UUID_REGEXP.test(value)) {
    return `Cluster ID '${value}' is not a valid UUID.`;
  }
  return undefined;
};

// Function to validate the cluster display name length
const checkClusterDisplayName = (value) => {
  if (!value) {
    return undefined;
  }
  if (value.length > MAX_CLUSTER_DISPLAY_NAME_LENGTH) {
    return `Cluster display name may not exceed ${MAX_CLUSTER_DISPLAY_NAME_LENGTH} characters.`;
  }
  return undefined;
};

const checkUserID = (value) => {
  if (!value) {
    return 'User ID cannot be empty.';
  }
  if (value.trim() !== value) {
    return 'User ID cannot contain leading and trailing spaces';
  }
  if (value.includes('/')) {
    return 'User ID cannot contain \'/\'.';
  }
  if (value.includes(':')) {
    return 'User ID cannot contain \':\'.';
  }
  if (value.includes('%')) {
    return 'User ID cannot contain \'%\'.';
  }
  if (value === '~') {
    return 'User ID cannot be \'~\'.';
  }
  if (value === '.') {
    return 'User ID cannot be \'.\'.';
  }
  if (value === '..') {
    return 'User ID cannot be \'..\'.';
  }
  return undefined;
};

// Function to validate the cluster console URL
const checkClusterConsoleURL = (value, isRequired) => {
  if (!value) {
    return (isRequired ? 'Cluster console URL should not be empty' : undefined);
  }
  let url;
  try {
    url = new URL(value);
  } catch (error) {
    if (!(value.startsWith('http://') || value.startsWith('https://'))) {
      return 'The URL should include the scheme prefix (http://, https://)';
    }
    return 'Invalid URL';
  }
  if (!CONSOLE_URL_REGEXP.test(value)) {
    if (!(url.protocol === 'http:' || url.protocol === 'https:')) {
      return 'The URL should include the scheme prefix (http://, https://)';
    }
    if (url.hash !== '' || url.search !== '') {
      return 'The URL must not include a query string (?) or fragment (#)';
    }
    return 'Invalid URL';
  }
  return undefined;
};

// Function to validate that a field contains a correct base DNS domain
const checkBaseDNSDomain = (value) => {
  if (!value) {
    return 'Base DNS domain is required.';
  }
  if (!BASE_DOMAIN_REGEXP.test(value)) {
    return `Base DNS domain '${value}' isn't valid, must contain at least two valid lower-case DNS labels separated by dots, for example 'mydomain.com'.`;
  }
  return undefined;
};

// Function to validate IP address blocks
const cidr = (value) => {
  if (value && !CIDR_REGEXP.test(value)) {
    return `IP address range '${value}' isn't valid CIDR notation. It must follow the RFC-4632 format: '192.168.0.0/16'.`;
  }
  return undefined;
};

const getCIDRSubnet = (value) => {
  if (!value) {
    return undefined;
  }

  return parseInt(value.split('/').pop(), 10);
};

const machineCidr = (value, formData) => {
  if (!value) {
    return undefined;
  }

  const isMultiAz = formData.multi_az === 'true';
  const prefixLength = getCIDRSubnet(value);

  if (isMultiAz && prefixLength > MACHINE_CIDR_MAX_MULTI_AZ) {
    const maxComputeNodes = 2 ** (28 - MACHINE_CIDR_MAX_MULTI_AZ);
    const multiAZ = (maxComputeNodes - 9) * 3;
    return `The subnet length can't be higher than '/${MACHINE_CIDR_MAX_MULTI_AZ}', which provides up to ${multiAZ} nodes.`;
  }

  if (!isMultiAz && prefixLength > MACHINE_CIDR_MAX_SINGLE_AZ) {
    const maxComputeNodes = 2 ** (28 - MACHINE_CIDR_MAX_SINGLE_AZ);
    const singleAZ = maxComputeNodes - 9;
    return `The subnet length can't be higher than '/${MACHINE_CIDR_MAX_SINGLE_AZ}', which provides up to ${singleAZ} nodes.`;
  }

  return undefined;
};

const serviceCidr = (value) => {
  if (!value) {
    return undefined;
  }

  const prefixLength = getCIDRSubnet(value);

  if (prefixLength > SERVICE_CIDR_MAX) {
    const maxServices = 2 ** (32 - SERVICE_CIDR_MAX) - 2;
    return `The subnet length can't be higher than '/${SERVICE_CIDR_MAX}', which provides up to ${maxServices} services.`;
  }

  return undefined;
};

const podCidr = (value, formData) => {
  if (!value) {
    return undefined;
  }

  const prefixLength = getCIDRSubnet(value);

  if (prefixLength > POD_CIDR_MAX) {
    const hostPrefix = getCIDRSubnet(formData.network_host_prefix) || 23;
    const maxPodIPs = 2 ** (32 - hostPrefix);
    const maxPodNodes = Math.floor(2 ** (32 - POD_CIDR_MAX) / maxPodIPs);
    return `The subnet length can't be higher than '/${POD_CIDR_MAX}', which provides up to ${maxPodNodes} nodes.`;
  }

  return undefined;
};

// Function to validate IP address masks
const hostPrefix = (value) => {
  if (!value) {
    return undefined;
  }

  if (!HOST_PREFIX_REGEXP.test(value)) {
    return `The value '${value}' isn't a valid subnet mask. It must follow the RFC-4632 format: '/16'.`;
  }

  const prefixLength = getCIDRSubnet(value);

  if (prefixLength < HOST_PREFIX_MIN) {
    const maxPodIPs = 2 ** (32 - HOST_PREFIX_MIN) - 2;
    return `The subnet length can't be lower than '/${HOST_PREFIX_MIN}', which provides up to ${maxPodIPs} Pod IP addresses.`;
  }
  if (prefixLength > HOST_PREFIX_MAX) {
    const maxPodIPs = 2 ** (32 - HOST_PREFIX_MAX) - 2;
    return `The subnet length can't be higher than '/${HOST_PREFIX_MAX}', which provides up to ${maxPodIPs} Pod IP addresses.`;
  }

  return undefined;
};

/**
 * Function to validate number of nodes.
 *
 * @param {(string|number)} value - node count to validate.
 * @param {*} min - object ontaining int 'value' of minimum node count,
 * and a string 'validationMsg' with an error message.
 * @param {number} [max=MAX_NODE_COUNT] - maximum allowed number of nodes.
 */
const nodes = (value, min, max = MAX_NODE_COUNT) => {
  if (value === undefined || value < min.value) {
    return (min.validationMsg || `The minimum number of nodes is ${min.value}.`);
  }
  if (value > max) {
    return `Maximum number allowed is ${max}.`;
  }
  // eslint-disable-next-line eqeqeq
  if (Number.isNaN(parseInt(value, 10)) || Math.floor(value) != value) {
    // Using Math.floor to check for valid int because Number.isInteger doesn't work on IE.
    return `'${value}' is not a valid number of nodes.`;
  }
  return undefined;
};

const nodesMultiAz = (value) => {
  if (value % 3 > 0) {
    return 'Number of nodes must be multiple of 3 for Multi AZ cluster.';
  }
  return undefined;
};

/**
 * General function used to validate numeric user input according to some flags.
 * Returns an informative error message when taking an illegal input.
 * @param {*} input           Input string
 * @param {*} allowDecimal    true if input number may have a decimal point,
 *                            false if it must be an integer
 * @param {*} allowNeg        true if input number may be negative, otherwise false
 * @param {*} allowZero       true if input number may be 0, otherwise false
 */
const validateNumericInput = (
  input, {
    allowDecimal = false,
    allowNeg = false,
    allowZero = false,
    max = NaN,
  } = {},
) => {
  if (!input) {
    return undefined; // accept empty input. Further validation done according to field
  }

  const value = Number(input);
  if (Number.isNaN(value)) {
    return 'Input must be a number.';
  }
  if (!allowNeg && !allowZero && value <= 0) {
    return 'Input must be a positive number.';
  }
  if (!allowNeg && allowZero && value < 0) {
    return 'Input must be a non-negative number.';
  }
  if (!allowDecimal && input.toString().includes('.')) {
    return 'Input must be an integer.';
  }
  if (!Number.isNaN(max) && value > max) {
    return `Input cannot be more than ${max}.`;
  }
  return undefined;
};

const checkDisconnectedConsoleURL = value => checkClusterConsoleURL(value, false);

const checkDisconnectedvCPU = value => validateNumericInput(value, { max: 16000 });

const checkDisconnectedSockets = value => validateNumericInput(value, { max: 2000 });

const checkDisconnectedMemCapacity = value => (
  validateNumericInput(value, { allowDecimal: true, max: 256000 })
);

const checkDisconnectedNodeCount = (value) => {
  if (value === '') {
    return undefined;
  }
  if (Number.isNaN(Number(value))) {
    return 'Input must be a number.';
  }
  return nodes(Number(value), { value: 0 }, 250);
};

const validateARN = (value) => {
  if (!value) {
    return 'Field is required';
  }
  if (!AWS_ARN_REGEX.test(value)) {
    return 'ARN value should be in the format arn:aws:iam::123456789012:user/name.';
  }
  return undefined;
};

/**
 * for ReduxFieldArray, validate there is at least one filled value.
 * Note that since ReduxFieldArray stores the input's key/id with each value,
 * and the value itself under a key with the name of the input
 * - this function is not like other validators, it's a function that returns a function,
 * so you can specify the field name.
 *
 * @param {*} values array of value objects, from redux-form
 */
const atLeastOneRequired = fieldName => (fields) => {
  if (!fields) {
    return undefined;
  }
  let nonEmptyValues = 0;
  fields.forEach((field) => {
    const content = get(field, fieldName, null);
    if (content && content.trim() !== '') {
      nonEmptyValues += 1;
    }
  });
  if (nonEmptyValues === 0) {
    return 'At least one is required.';
  }
  return undefined;
};

const validators = {
  required,
  checkIdentityProviderName,
  checkClusterName,
  checkClusterUUID,
  checkClusterDisplayName,
  checkUserID,
  checkBaseDNSDomain,
  cidr,
  machineCidr,
  serviceCidr,
  podCidr,
  hostPrefix,
  nodes,
  nodesMultiAz,
  validateNumericInput,
  checkOpenIDIssuer,
  checkGithubTeams,
  checkRouteSelectors,
  checkDisconnectedConsoleURL,
  checkDisconnectedvCPU,
  checkDisconnectedSockets,
  checkDisconnectedMemCapacity,
  checkDisconnectedNodeCount,
};

export {
  required,
  atLeastOneRequired,
  checkClusterUUID,
  checkIdentityProviderName,
  checkClusterDisplayName,
  checkUserID,
  checkClusterConsoleURL,
  checkOpenIDIssuer,
  checkGithubTeams,
  checkRouteSelectors,
  checkDisconnectedConsoleURL,
  checkDisconnectedvCPU,
  checkDisconnectedSockets,
  checkDisconnectedMemCapacity,
  checkDisconnectedNodeCount,
  validateARN,
};

export default validators;
