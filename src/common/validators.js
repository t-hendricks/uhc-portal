// Valid RFC-1035 labels must consist of lower case alphanumeric characters or '-', start with an
// alphabetic character, and end with an alphanumeric character (e.g. 'my-name',  or 'abc-123').
const DNS_LABEL_REGEXP = /^[a-z]([-a-z0-9]*[a-z0-9])?$/;

// Regular expression used to check base DNS domains, based on RFC-1035
const BASE_DOMAIN_REGEXP = /^([a-z]([-a-z0-9]*[a-z0-9])?\.)+[a-z]([-a-z0-9]*[a-z0-9])?$/;


// Function to validate that a field is mandatory:
const required = value => (value ? undefined : 'Field is required');

// Function to validate that the cluster name field contains a valid DNS label:
const checkClusterName = (value) => {
  if (!value) {
    return 'Cluster name is required.';
  }
  if (!DNS_LABEL_REGEXP.test(value)) {
    return `Cluster name '${value}' isn't valid, must consist of lower-case alphanumeric characters or '-', start with an alphabetic character, and end with an alphanumeric character. For example, 'my-name', or 'abc-123'.`;
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


const validators = {
  required,
  checkClusterName,
  checkBaseDNSDomain,
};

export default validators;
