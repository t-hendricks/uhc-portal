// Valid RFC-1035 labels must consist of lower case alphanumeric characters or '-', start with an
// alphabetic character, and end with an alphanumeric character (e.g. 'my-name',  or 'abc-123').
const DNS_LABEL_REGEXP = /^[a-z]([-a-z0-9]*[a-z0-9])?$/;

// Regular expression used to check base DNS domains, based on RFC-1035
const BASE_DOMAIN_REGEXP = /^([a-z]([-a-z0-9]*[a-z0-9])?\.)+[a-z]([-a-z0-9]*[a-z0-9])?$/;

// Regular expression used to check UUID as specified in RFC4122.
const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Regular expression used to check whether input is a valid IPv4 CIDR range
const CIDR_REGEXP = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/(3[0-2]|[1-2][0-9]|[0-9]))$/;

// Regular expression for a valid URL for a console in a self managed cluster.
const CONSOLE_URL_REGEXP = /^https?:\/\/(([0-9]{1,3}\.){3}[0-9]{1,3}|([a-z0-9-]+\.)+[a-z]{2,})(:[0-9]+)?([a-z0-9_/-]+)?$/i;

// Maximum length for a cluster name
const MAX_CLUSTER_NAME_LENGTH = 50;

// Maximum length of a cluster display name
const MAX_CLUSTER_DISPLAY_NAME_LENGTH = 63;

// Maximum node count
const MAX_NODE_COUNT = 180;

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
  if (value.includes('/')) {
    return 'User ID cannot contain \'/\'.';
  }
  return undefined;
};

// Function to validate the cluster console URL
const checkClusterConsoleURL = (value, isRequired) => {
  if (!value) {
    return (isRequired ? 'Cluster console URL should not be empty' : undefined);
  }
  if (!CONSOLE_URL_REGEXP.test(value)) {
    return 'Invalid URL. Please provide a valid URL address without a query string (?) or fragment (#)';
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

// Function to validate number of nodes. The 'min' is an object containing int 'value' of minimum
// node count, and a string 'validationMsg' with an error message
const nodes = (value, min) => {
  if (value === undefined || value < min.value) {
    return (min.validationMsg || `The minimum number of nodes is ${min.value}.`);
  }
  if (value > MAX_NODE_COUNT) {
    return `Maximum number allowed is ${MAX_NODE_COUNT}.`;
  }
  // eslint-disable-next-line eqeqeq
  if (!parseInt(value, 10) || Math.floor(value) != value) {
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

const github = value => (value ? undefined : 'Either "Teams" or "Organizations" are required');

/**
 * General function used to validate numeric user input according to some flags.
 * Returns an informative error message when taking an illegal input.
 * @param {*} input           Input string
 * @param {*} allowDecimal    true if input number may have a decimal point,
 *                            false if it must be an integer
 * @param {*} allowNeg        true if input number may be negative, otherwise false
 * @param {*} allowZero       true if input number may be 0, otherwise false
 * @param {*} isRequired      true if input is required and may not be empty
 */
const validateNumericInput = (
  input, {
    allowDecimal = false,
    allowNeg = false,
    allowZero = false,
  } = {},
) => {
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
  if (!allowDecimal && input.includes('.')) {
    return 'Input must be an integer.';
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
  nodes,
  nodesMultiAz,
  github,
  validateNumericInput,
};

export {
  required,
  github,
  checkClusterUUID,
  checkIdentityProviderName,
  checkClusterDisplayName,
  checkUserID,
  checkClusterConsoleURL,
};

export default validators;
