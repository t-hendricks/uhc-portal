// Valid RFC-1035 labels must consist of lower case alphanumeric characters or '-', start with an
// alphabetic character, and end with an alphanumeric character (e.g. 'my-name',  or 'abc-123').
const DNS_LABEL_REGEXP = /^[a-z]([-a-z0-9]*[a-z0-9])?$/;

// Regular expression used to check base DNS domains, based on RFC-1035
const BASE_DOMAIN_REGEXP = /^([a-z]([-a-z0-9]*[a-z0-9])?\.)+[a-z]([-a-z0-9]*[a-z0-9])?$/;

// Regular expression used to check whether input is a valid IPv4 CIDR range
const CIDR_REGEXP = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/(3[0-2]|[1-2][0-9]|[0-9]))$/;

// Maximum length for a router shard label
const MAX_ROUTER_SHARD_LABEL = 63;

// Maximum length for a cluster name
const MAX_CLUSTER_NAME_LENGTH = 100;

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
    return 'Cluster names may not exceed 100 characters.';
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
    return min.validationMsg;
  }
  // eslint-disable-next-line eqeqeq
  if (!parseInt(value, 10) || Math.floor(value) != value) {
    // Using Math.floor to check for valid int because Number.isInteger doesn't work on IE.
    return `'${value}' is not a valid number of nodes.`;
  }
  return undefined;
};

// Function to validate that the router shard label contains a valid DNS label:
const routerShard = (value) => {
  if (!value) {
    return undefined;
  }
  if (value.length > MAX_ROUTER_SHARD_LABEL) {
    return `Router shard label '${value}' is too long, it needs to be under ${MAX_ROUTER_SHARD_LABEL} charcters long.`;
  }
  if (!DNS_LABEL_REGEXP.test(value)) {
    return `Router shard label '${value}' isn't valid, must consist of lower-case alphanumeric characters or '-', start with an alphabetic character, and end with an alphanumeric character. For example, 'my-label', or 'abc-123'.`;
  }
  return undefined;
};

const github = value => (value ? undefined : 'Either "Teams" or "Organizations" are required');


const validators = {
  required,
  checkIdentityProviderName,
  checkClusterName,
  checkBaseDNSDomain,
  cidr,
  nodes,
  routerShard,
  github,
};

export { github };

export default validators;
