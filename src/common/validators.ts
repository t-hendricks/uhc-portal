import { get, indexOf, inRange } from 'lodash';
import cidrTools from 'cidr-tools';
import { ValidationError, Validator } from 'jsonschema';
import { clusterService } from '~/services';
import type { GCP } from '../types/clusters_mgmt.v1';
import type { AugmentedSubnetwork, SubnetFormProps } from '../types/types';
import { sqlString } from './queryHelpers';

type Networks = Parameters<typeof cidrTools['overlap']>[0];

// Valid RFC-1035 labels must consist of lower case alphanumeric characters or '-', start with an
// alphabetic character, and end with an alphanumeric character (e.g. 'my-name',  or 'abc-123').
const DNS_LABEL_REGEXP = /^[a-z]([-a-z0-9]*[a-z0-9])?$/;
const DNS_ONLY_ALPHANUMERIC_HYPHEN = /^[-a-z0-9]+$/;
const DNS_START_ALPHA = /^[a-z]/;
const DNS_END_ALPHANUMERIC = /[a-z0-9]$/;

// Regular expression used to check base DNS domains, based on RFC-1035
const BASE_DOMAIN_REGEXP = /^([a-z]([-a-z0-9]*[a-z0-9])?\.)+[a-z]([-a-z0-9]*[a-z0-9])?$/;

// Regular expression used to check general subdomain structure, based on RFC-1035
const DNS_SUBDOMAIN_REGEXP = /^([a-z]([-a-z0-9]*[a-z0-9])?)+(\.[a-z]([-a-z0-9]*[a-z0-9])?)*$/;

// Regular expression used to check UUID as specified in RFC4122.
const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Regular expression used to check whether input is a valid IPv4 CIDR range
const CIDR_REGEXP =
  /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/(3[0-2]|[1-2][0-9]|[1-9]))$/;
const SERVICE_CIDR_MAX = 24;
const POD_CIDR_MAX = 21;
const POD_NODES_MIN = 32;
const AWS_MACHINE_CIDR_MIN = 16;
const AWS_MACHINE_CIDR_MAX_SINGLE_AZ = 25;
const AWS_MACHINE_CIDR_MAX_MULTI_AZ = 24;
const GCP_MACHINE_CIDR_MAX = 23;

// Regular expression used to check whether input is a valid IPv4 subnet prefix length
const HOST_PREFIX_REGEXP = /^\/?(3[0-2]|[1-2][0-9]|[0-9])$/;
const HOST_PREFIX_MIN = 23;
const HOST_PREFIX_MAX = 26;
const DOCKER_CIDR_RANGE = '172.17.0.0/16';

// Regular expression for a valid URL for a console in a self managed cluster.
const CONSOLE_URL_REGEXP =
  /^https?:\/\/(([0-9]{1,3}\.){3}[0-9]{1,3}|([a-z0-9-]+\.)+[a-z]{2,})(:[0-9]+)?([a-z0-9_/-]+)?$/i;

// Maximum length for a cluster name
const MAX_CLUSTER_NAME_LENGTH = 15;

const MAX_MACHINE_POOL_NAME_LENGTH = 30;

// Maximum length of a cluster display name
const MAX_CLUSTER_DISPLAY_NAME_LENGTH = 63;

const GCP_SUBNET_NAME_MAXLEN = 63;
// Maximum node count
const MAX_NODE_COUNT = 180;

const AWS_ARN_REGEX = /^arn:aws:iam::\d{12}:(user|group)\/\S+/;

const LABEL_VALUE_MAX_LENGTH = 63;

const LABEL_KEY_NAME_MAX_LENGTH = 63;

const LABEL_KEY_PREFIX_MAX_LENGTH = 253;

const AWS_NUMERIC_ACCOUNT_ID_REGEX = /^\d{12}$/;

const GCP_KMS_SERVICE_ACCOUNT_REGEX = /^[a-z0-9.+-]+@[\w.-]+\.[a-z]{2,4}$/;

const AWS_KMS_SERVICE_ACCOUNT_REGEX =
  /^arn:aws:kms:[\w-]+:\d{12}:key\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

/**
 * A valid label key name must consist of alphanumeric characters, '-', '_' or '.',
 * and must start and end with an alphanumeric character. e.g. 'MyName', 'my.name',
 * or '123-abc'.
 * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set
 */
const LABEL_KEY_NAME_REGEX = /^([a-z0-9][a-z0-9-_.]*)?[a-z0-9]$/i;

/**
 * A valid label value must be an empty string or consist of alphanumeric characters, '-', '_'
 * or '.', and must start and end with an alphanumeric character. e.g. 'MyValue', or 'my_value',
 * or '12345'
 * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set
 */
const LABEL_VALUE_REGEX = /^(([a-z0-9][a-z0-9-_.]*)?[a-z0-9])?$/i;

const MAX_CUSTOM_OPERATOR_ROLES_PREFIX_LENGTH = 32;

// Function to validate that a field is mandatory, i.e. must be a non whitespace string
const required = (value: string): string | undefined =>
  value && value.trim() ? undefined : 'Field is required';

// Function to validate that a field has a true value.
// Use with checkbox to ensure it is selected on a form, e.g. Ts&Cs agreement
const requiredTrue = (value: string | boolean): string | undefined =>
  value && value === true ? undefined : 'Field must be selected';

// Function to validate that user has acknowledged prerequisites by clicking checkbox.
const acknowledgePrerequisites = (value: string | boolean): string | undefined =>
  value && value === true
    ? undefined
    : 'Acknowledge that you have read and completed all prerequisites.';

// Function to validate that the identity provider name field doesn't include whitespaces:
const checkIdentityProviderName = (value: string): string | undefined => {
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
const checkOpenIDIssuer = (value: string): string | undefined => {
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

  // url.hash doesnt work for https://issuer.com# and it succeeds.
  // added explicit validation for that scenario
  if (url.href.includes('#')) {
    return 'The URL must not include a query string (?) or fragment (#)';
  }

  return undefined;
};

// Function to validate that the object name contains a valid DNS label:
const checkObjectName = (value: string, objectName: string, maxLen: number): string | undefined => {
  if (!value) {
    return `${objectName} name is required.`;
  }
  if (!DNS_LABEL_REGEXP.test(value)) {
    return `${objectName} name '${value}' isn't valid, must consist of lower-case alphanumeric characters or '-', start with an alphabetic character, and end with an alphanumeric character. For example, 'my-name', or 'abc-123'.`;
  }
  if (value.length > maxLen) {
    return `${objectName} names may not exceed ${maxLen} characters.`;
  }
  return undefined;
};

const checkObjectNameValidation = (value: string, objectName: string, maxLen: number) => [
  {
    text: `1 - ${maxLen} characters`,
    validated: value?.length > 0 && value?.length <= maxLen,
  },
  {
    text: 'Consist of lower-case alphanumeric characters, or hyphen (-)',
    validated: !!value && DNS_ONLY_ALPHANUMERIC_HYPHEN.test(value),
  },
  {
    text: 'Start with a lower-case alphabetic character',
    validated: !!value && DNS_START_ALPHA.test(value),
  },
  {
    text: 'End with a lower-case alphanumeric character',
    validated: !!value && DNS_END_ALPHANUMERIC.test(value),
  },
];

const checkObjectNameAsyncValidation = (value: string) => [
  {
    text: 'Globally unique name in your organization',
    validator: async () => {
      if (!value?.length) {
        return false;
      }
      const search = `name = ${sqlString(value)}`;
      const { data } = await clusterService.getClusters(search, 1);
      // Normally, we get 0 or 1 items, 1 meaning a cluster of that name already exists.
      // But dumb mockserver ignores `search` and `size`, always returns full static list;
      // checking the returned name(s) allows this validation to work in ?env=mockdata UI.
      return !data?.items?.some((cluster) => cluster.name === value);
    },
  },
];

const clusterNameValidation = (value: string) =>
  checkObjectNameValidation(value, 'Cluster', MAX_CLUSTER_NAME_LENGTH);

const clusterNameAsyncValidation = (value: string) => checkObjectNameAsyncValidation(value);

const checkMachinePoolName = (value: string) =>
  checkObjectName(value, 'Machine pool', MAX_MACHINE_POOL_NAME_LENGTH);

/**
 * executes cluster-name async validations.
 * to be used at the form level hook (asyncValidate).
 *
 * @see asyncValidate in the wizard's redux-form config.
 * @param value the value to be validated
 * @returns {Promise<void>} a promise which resolves quietly, or rejects with a form errors map.
 */
const asyncValidateClusterName = async (value: string) => {
  const evaluatedAsyncValidation = await evaluateClusterNameAsyncValidation(value);
  return findFirstFailureMessage(evaluatedAsyncValidation);
};

const createAsyncValidationEvaluator =
  (
    asyncValidation: (value: string) => {
      text: string;
      validator: () => Promise<boolean>;
    }[],
  ) =>
  async (value: string) => {
    const populatedValidation = asyncValidation(value);
    const validationResults = await Promise.all(
      populatedValidation.map(({ validator }) => validator?.()),
    );

    return populatedValidation.map((item, i) => ({
      ...item,
      validated: validationResults[i],
    }));
  };

const evaluateClusterNameAsyncValidation = createAsyncValidationEvaluator(
  clusterNameAsyncValidation,
);

/**
 * creates a validator function that exits on first failure (and returns its error message),
 * using the validation provider output collection as its input.
 *
 * @param validationProvider {function(*, object, object, object): array}
 *        a function that returns a collection of validations,
 *        and can be passed to a Field's validation attribute.
 *        first argument is the value, second is allValues, etc. (see the redux-form docs).
 * @returns {function(*): *} a validator function that exits on the first failed validation,
 *          outputting its error message.
 */
const createPessimisticValidator =
  <V>(
    validationProvider: (
      value: V,
      allValues?: any,
      props?: any,
      name?: any,
    ) =>
      | {
          validated: boolean;
          text: string;
        }[]
      | undefined = () => undefined,
  ) =>
  (value: V, allValues?: any, props?: any, name?: any) =>
    findFirstFailureMessage(validationProvider(value, allValues, props, name));

const findFirstFailureMessage = (
  populatedValidation:
    | {
        validated: boolean;
        text: string;
      }[]
    | undefined,
) => populatedValidation?.find((validation) => validation.validated === false)?.text;

const checkCustomOperatorRolesPrefix = (value: string): string | undefined => {
  const label = 'Custom operator roles prefix';
  if (!value) {
    return undefined;
  }
  if (!DNS_LABEL_REGEXP.test(value)) {
    return `${label} '${value}' isn't valid, must consist of lower-case alphanumeric characters or '-', start with an alphabetic character, and end with an alphanumeric character. For example, 'my-name', or 'abc-123'.`;
  }
  if (value.length > MAX_CUSTOM_OPERATOR_ROLES_PREFIX_LENGTH) {
    return `${label} may not exceed ${MAX_CUSTOM_OPERATOR_ROLES_PREFIX_LENGTH} characters.`;
  }
  return undefined;
};

// Function to validate that the github team is formatted: <org/team>
const checkGithubTeams = (value: string): string | undefined => {
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

const parseNodeLabelKey = (
  labelKey: string,
): { name: string | undefined; prefix: string | undefined } => {
  const [name, prefix] =
    labelKey
      // split at the first delimiter, and only keep the first two segments,
      // to get rid of the empty match at the end
      ?.split(/\/(.+)/, 2)
      // reverse order before destructuring to ensure the name is always defined,
      // while the prefix is left undefined if missing
      ?.reverse() ?? [];

  return { name, prefix };
};

const parseNodeLabelTags = (labels: string[]) =>
  ([] as string[]).concat(labels).map((pair) => pair.split('='));

const parseNodeLabels = (input: string | string[] | undefined) => {
  // avoid processing falsy values (and specifically, empty strings)
  if (!input) {
    return undefined;
  }
  // turn the input into an array, if necessary
  const labels = typeof input === 'string' ? input.split(',') : input;

  return parseNodeLabelTags(labels);
};

const labelKeyValidations = (
  value: string,
): {
  validated: boolean;
  text: string;
}[] => {
  const { prefix, name } = parseNodeLabelKey(value);

  return [
    {
      validated: typeof prefix === 'undefined' || DNS_SUBDOMAIN_REGEXP.test(prefix),
      text: 'Key prefix must be a DNS subdomain: a series of DNS labels separated by dots (.)',
    },
    {
      validated: typeof prefix === 'undefined' || prefix.length <= LABEL_KEY_PREFIX_MAX_LENGTH,
      text: `A valid key prefix must be ${LABEL_KEY_PREFIX_MAX_LENGTH} characters or less`,
    },
    {
      validated: typeof name !== 'undefined' && LABEL_KEY_NAME_REGEX.test(name),
      text: "A valid key name must consist of alphanumeric characters, '-', '.' or '_' and must start and end with an alphanumeric character",
    },
    {
      validated: typeof name !== 'undefined' && name.length <= LABEL_KEY_NAME_MAX_LENGTH,
      text: `A valid key name must be ${LABEL_KEY_NAME_MAX_LENGTH} characters or less`,
    },
  ];
};

const labelValueValidations = (
  value: string,
): {
  validated: boolean;
  text: string;
}[] => [
  {
    validated: typeof value === 'undefined' || value.length <= LABEL_VALUE_MAX_LENGTH,
    text: `A valid value must be ${LABEL_VALUE_MAX_LENGTH} characters or less`,
  },
  {
    validated: typeof value === 'undefined' || LABEL_VALUE_REGEX.test(value),
    text: "A valid value must consist of alphanumeric characters, '-', '.' or '_' and must start and end with an alphanumeric character",
  },
];

const checkLabelKey = createPessimisticValidator(labelKeyValidations);

const checkLabelValue = createPessimisticValidator(labelValueValidations);

const checkLabels = (input: string | string[]) =>
  parseNodeLabels(input)
    // collect the first error found
    ?.reduce<string | undefined>(
      (accum, [key, value]) => accum ?? checkLabelKey(key) ?? checkLabelValue(value),
      // defaulting to undefined
      undefined,
    );

const checkRouteSelectors = checkLabels;

// Function to validate that the cluster ID field is a UUID:
const checkClusterUUID = (value: string): string | undefined => {
  if (!value) {
    return 'Cluster ID is required.';
  }
  if (!UUID_REGEXP.test(value)) {
    return `Cluster ID '${value}' is not a valid UUID.`;
  }
  return undefined;
};

// Function to validate the cluster display name length
const checkClusterDisplayName = (value: string): string | undefined => {
  if (!value) {
    return undefined;
  }
  if (value.length > MAX_CLUSTER_DISPLAY_NAME_LENGTH) {
    return `Cluster display name may not exceed ${MAX_CLUSTER_DISPLAY_NAME_LENGTH} characters.`;
  }
  return undefined;
};

const checkUser = (value: string): string | undefined => {
  if (!value) {
    return 'cannot be empty.';
  }
  if (value.trim() !== value) {
    return 'cannot contain leading and trailing spaces';
  }
  if (value.includes('/')) {
    return "cannot contain '/'.";
  }
  if (value.includes(':')) {
    return "cannot contain ':'.";
  }
  if (value.includes('%')) {
    return "cannot contain '%'.";
  }
  if (value === '~') {
    return "cannot be '~'.";
  }
  if (value === '.') {
    return "cannot be '.'.";
  }
  if (value === '..') {
    return "cannot be '..'.";
  }
  // User cluster-admin is reserved for internal use with the HTPasswd IdP
  if (value === 'cluster-admin') {
    return "cannot be 'cluster-admin'.";
  }
  return undefined;
};

const checkUserID = (value: string): string | undefined => {
  const invalid = checkUser(value);
  return invalid ? `User ID ${invalid}` : undefined;
};

const RHIT_PRINCIPAL_PATTERN = /^[^"$<> ^|%\\(),=;~:/*\r\n]*$/;
const validateRHITUsername = (username: string): string | undefined => {
  const valid = RHIT_PRINCIPAL_PATTERN.test(username);
  return valid ? undefined : 'Username includes illegal symbols';
};

const validateUrl = (value: string, protocol: string | string[] = 'http'): string | undefined => {
  if (!value) {
    return undefined;
  }
  let protocolArr: string[];
  if (typeof protocol === 'string') {
    protocolArr = [protocol];
  } else {
    protocolArr = protocol;
  }
  try {
    // eslint-disable-next-line no-new
    new URL(value);
  } catch (error) {
    return 'Invalid URL';
  } finally {
    const valueStart = value.substring(0, value.indexOf('://'));
    if (!protocolArr.includes(valueStart)) {
      const protocolStr = protocolArr.map((p) => `${p}://`).join(', ');
      // eslint-disable-next-line no-unsafe-finally
      return `The URL should include the scheme prefix (${protocolStr})`;
    }
  }
  return undefined;
};

const validateCA = (value: string): string | undefined => {
  if (!value) {
    return undefined;
  }
  if (value === 'Invalid file') {
    return 'Must be a PEM encoded X.509 file (.pem, .crt, .ca, .cert) and no larger than 4 MB';
  }
  return undefined;
};

// Function to validate the cluster console URL
const checkClusterConsoleURL = (value: string, isRequired?: false): string | undefined => {
  if (!value) {
    return isRequired ? 'Cluster console URL should not be empty' : undefined;
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
const checkBaseDNSDomain = (value: string): string | undefined => {
  if (!value) {
    return 'Base DNS domain is required.';
  }
  if (!BASE_DOMAIN_REGEXP.test(value)) {
    return `Base DNS domain '${value}' isn't valid, must contain at least two valid lower-case DNS labels separated by dots, for example 'mydomain.com'.`;
  }
  return undefined;
};

const checkDNSDomain = (value?: string[]) => {
  if (value && value.length > 0) {
    const invalidDomains = value.filter(
      (domain) =>
        !!domain && !(BASE_DOMAIN_REGEXP.test(domain) && DNS_SUBDOMAIN_REGEXP.test(domain)),
    );
    const plural = invalidDomains.length > 1;
    if (invalidDomains.length > 0) {
      return `The domain${plural ? 's' : ''} '${invalidDomains.join(', ')}' ${
        plural ? "aren't" : "isn't"
      } valid, 
      must contain at least two valid lower-case DNS labels separated by dots, for example 'domain.com' or 'sub.domain.com'.`;
    }
  }
  return undefined;
};

// Function to validate IP address blocks
const cidr = (value: string): string | undefined => {
  if (value && !CIDR_REGEXP.test(value)) {
    return `IP address range '${value}' isn't valid CIDR notation. It must follow the RFC-4632 format: '192.168.0.0/16'.`;
  }
  return undefined;
};

const getCIDRSubnetLength = (value: string): number | undefined => {
  if (!value) {
    return undefined;
  }

  return parseInt(value.split('/').pop() ?? '', 10);
};

const awsMachineCidr = (value: string, formData: Record<string, string>): string | undefined => {
  if (!value) {
    return undefined;
  }

  const isMultiAz = formData.multi_az === 'true';
  const prefixLength = getCIDRSubnetLength(value);

  if (prefixLength != null) {
    if (prefixLength < AWS_MACHINE_CIDR_MIN) {
      return `The subnet mask can't be larger than '/${AWS_MACHINE_CIDR_MIN}'.`;
    }

    if (isMultiAz && prefixLength > AWS_MACHINE_CIDR_MAX_MULTI_AZ) {
      return `The subnet mask can't be smaller than '/${AWS_MACHINE_CIDR_MAX_MULTI_AZ}'.`;
    }

    if (!isMultiAz && prefixLength > AWS_MACHINE_CIDR_MAX_SINGLE_AZ) {
      return `The subnet mask can't be smaller than '/${AWS_MACHINE_CIDR_MAX_SINGLE_AZ}'.`;
    }
  }

  return undefined;
};

// Temporarily removed until messaging can be vetted according to https://issues.redhat.com/browse/HAC-2118.
/* eslint-disable max-len */
/*
const gcpMachineCidr = (value: string, formData: { ['multi_az']: string }): string | undefined => {
  if (!value) {
    return undefined;
  }

  const isMultiAz = formData.multi_az === 'true';
  const prefixLength = getCIDRSubnetLength(value);

  if (prefixLength != null) {
    if (isMultiAz && prefixLength > GCP_MACHINE_CIDR_MAX) {
      const maxComputeNodes = 2 ** (28 - GCP_MACHINE_CIDR_MAX);
      const multiAZ = (maxComputeNodes - 9) * 3;
      return `The subnet mask can't be smaller than '/${GCP_MACHINE_CIDR_MAX}', which provides up to ${multiAZ} nodes.`;
    }

    if (!isMultiAz && prefixLength > GCP_MACHINE_CIDR_MAX) {
      const maxComputeNodes = 2 ** (28 - GCP_MACHINE_CIDR_MAX);
      const singleAZ = maxComputeNodes - 9;
      return `The subnet mask can't be smaller than '/${GCP_MACHINE_CIDR_MAX}', which provides up to ${singleAZ} nodes.`;
    }
  }

  return undefined;
};
*/
/* eslint-enable max-len */

const serviceCidr = (value: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  const prefixLength = getCIDRSubnetLength(value);

  if (prefixLength != null) {
    if (prefixLength > SERVICE_CIDR_MAX) {
      const maxServices = 2 ** (32 - SERVICE_CIDR_MAX) - 2;
      return `The subnet mask can't be smaller than '/${SERVICE_CIDR_MAX}', which provides up to ${maxServices} services.`;
    }
  }

  return undefined;
};

const podCidr = (value: string, formData: Record<string, string>): string | undefined => {
  if (!value) {
    return undefined;
  }

  const prefixLength = getCIDRSubnetLength(value);
  if (prefixLength != null) {
    if (prefixLength > POD_CIDR_MAX) {
      return `The subnet mask can't be smaller than /${POD_CIDR_MAX}.`;
    }

    const hostPrefix = getCIDRSubnetLength(formData.network_host_prefix) || 23;
    const maxPodIPs = 2 ** (32 - hostPrefix);
    const maxPodNodes = Math.floor(2 ** (32 - prefixLength) / maxPodIPs);
    if (maxPodNodes < POD_NODES_MIN) {
      return `The subnet mask of /${prefixLength} does not allow for enough nodes. Try changing the host prefix or the pod subnet range.`;
    }
  }

  return undefined;
};

const validateRange = (value: string): string | undefined => {
  if (cidr(value) !== undefined || !value) {
    return undefined;
  }
  const parts = value.split('/');
  const cidrBinaryString = parts[0]
    .split('.')
    .map((octet) => Number(octet).toString(2).padEnd(8, '0'))
    .join('');
  const maskBits = parseInt(parts[1], 10);
  const maskedBinaryString = cidrBinaryString.slice(0, maskBits).padEnd(32, '0');

  if (maskedBinaryString !== cidrBinaryString) {
    return 'This is not a subnet address. The subnet prefix is inconsistent with the subnet mask.';
  }
  return undefined;
};

const disjointSubnets =
  (fieldName: string) =>
  (value: string, formData: { [name: string]: Networks }): string | undefined => {
    if (!value) {
      return undefined;
    }

    const networkingFields: { [key: string]: string } = {
      network_machine_cidr: 'Machine CIDR',
      network_service_cidr: 'Service CIDR',
      network_pod_cidr: 'Pod CIDR',
    };
    delete networkingFields[fieldName];
    const overlappingFields: string[] = [];
    try {
      Object.keys(networkingFields).forEach((name) => {
        const fieldValue = get(formData, name, null);
        if (fieldValue && cidrTools.overlap(value, fieldValue)) {
          overlappingFields.push(networkingFields[name]);
        }
      });
    } catch (e) {
      return `Failed to parse CIDR: ${e}`;
    }
    const plural = overlappingFields.length > 1;
    if (overlappingFields.length > 0) {
      return `This subnet overlaps with the subnet${
        plural ? 's' : ''
      } in the ${overlappingFields.join(', ')} field${plural ? 's' : ''}.`;
    }
    return undefined;
  };

const privateAddress = (value: string): string | undefined => {
  if (cidr(value) !== undefined || !value) {
    return undefined;
  }
  const parts = value.split('/');
  const octets = parts[0].split('.').map((octet) => parseInt(octet, 10));
  const maskBits = parseInt(parts[1], 10);

  // 10.0.0.0/8 – 10.255.255.255
  if (octets[0] === 10 && maskBits >= 8) {
    return undefined;
  }

  // 172.16.0.0/12 – 172.31.255.255
  if (octets[0] === 172 && inRange(octets[1], 16, 32) && maskBits >= 12) {
    return undefined;
  }

  // 192.168.0.0/16 – 192.168.255.255
  if (octets[0] === 192 && octets[1] === 168 && maskBits >= 16) {
    return undefined;
  }

  return 'Range is not private.';
};

const disjointFromDockerRange = (value: string): string | undefined => {
  if (!value) {
    return undefined;
  }
  try {
    if (cidrTools.overlap(value, DOCKER_CIDR_RANGE)) {
      return 'Selected range must not overlap with 172.17.0.0/16.';
    }
    return undefined;
  } catch (e) {
    return `Failed to parse CIDR: ${e}`;
  }
};

const awsSubnetMask =
  (fieldName: string) =>
  (value: string): string | undefined => {
    if (cidr(value) !== undefined || !value) {
      return undefined;
    }
    const awsSubnetMaskRanges: { [key: string]: [number | undefined, number] } = {
      network_machine_cidr_single_az: [AWS_MACHINE_CIDR_MIN, AWS_MACHINE_CIDR_MAX_SINGLE_AZ],
      network_machine_cidr_multi_az: [AWS_MACHINE_CIDR_MIN, AWS_MACHINE_CIDR_MAX_MULTI_AZ],
      network_service_cidr: [undefined, SERVICE_CIDR_MAX],
    };
    const maskRange = awsSubnetMaskRanges[fieldName];
    const parts = value.split('/');
    const maskBits = parseInt(parts[1], 10);
    if (!maskRange[0]) {
      if (maskBits > maskRange[1] || maskBits < 1) {
        return `Subnet mask must be between /1 and /${maskRange[1]}.`;
      }
      return undefined;
    }
    if (!(maskRange[0] <= maskBits && maskBits <= maskRange[1])) {
      return `Subnet mask must be between /${maskRange[0]} and /${maskRange[1]}.`;
    }
    return undefined;
  };

// Function to validate IP address masks
const hostPrefix = (value: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  if (!HOST_PREFIX_REGEXP.test(value)) {
    return `The value '${value}' isn't a valid subnet mask. It must follow the RFC-4632 format: '/16'.`;
  }

  const prefixLength = getCIDRSubnetLength(value);

  if (prefixLength != null) {
    if (prefixLength < HOST_PREFIX_MIN) {
      const maxPodIPs = 2 ** (32 - HOST_PREFIX_MIN) - 2;
      return `The subnet mask can't be larger than '/${HOST_PREFIX_MIN}', which provides up to ${maxPodIPs} Pod IP addresses.`;
    }
    if (prefixLength > HOST_PREFIX_MAX) {
      const maxPodIPs = 2 ** (32 - HOST_PREFIX_MAX) - 2;
      return `The subnet mask can't be smaller than '/${HOST_PREFIX_MAX}', which provides up to ${maxPodIPs} Pod IP addresses.`;
    }
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
const nodes = (
  value: string | number,
  min: { value: number; validationMsg?: string },
  max = MAX_NODE_COUNT,
): string | undefined => {
  if (value === undefined || value < min.value) {
    return min.validationMsg || `The minimum number of nodes is ${min.value}.`;
  }
  if (value > max) {
    return `Maximum number allowed is ${max}.`;
  }

  if (
    (typeof value === 'string' && Number.isNaN(parseInt(value, 10))) ||
    Math.floor(Number(value)) !== Number(value)
  ) {
    // Using Math.floor to check for valid int because Number.isInteger doesn't work on IE.
    return `'${value}' is not a valid number of nodes.`;
  }
  return undefined;
};

const nodesMultiAz = (value: string | number): string | undefined => {
  if (Number(value) % 3 > 0) {
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
  input: string | undefined,
  { allowDecimal = false, allowNeg = false, allowZero = false, max = NaN, min = NaN } = {},
) => {
  if (!input) {
    return undefined; // accept empty input. Further validation done according to field
  }
  const value = Number(input);
  if (Number.isNaN(value)) {
    return 'Input must be a number.';
  }
  if (!Number.isNaN(min) && value < min) {
    return `Input cannot be less than ${min}.`;
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

const checkDisconnectedConsoleURL = (value: string) => checkClusterConsoleURL(value, false);

const checkDisconnectedvCPU = (value: string) => validateNumericInput(value, { max: 16000 });

const checkDisconnectedSockets = (value: string) => validateNumericInput(value, { max: 2000 });

const checkDisconnectedMemCapacity = (value: string) =>
  validateNumericInput(value, { allowDecimal: true, max: 256000 });

const checkDisconnectedNodeCount = (value: string): string | undefined => {
  if (value === '') {
    return undefined;
  }
  if (Number.isNaN(Number(value))) {
    return 'Input must be a number.';
  }
  return nodes(Number(value), { value: 0 }, 250);
};

const validateARN = (value: string): string | undefined => {
  if (!value) {
    return 'Field is required';
  }
  if (/\s/.test(value)) {
    return 'Value must not contain whitespaces.';
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
const atLeastOneRequired = (fieldName: string) => (fields: { name: string }[]) => {
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

const awsNumericAccountID = (input: string): string | undefined => {
  if (!input) {
    return 'AWS account ID is required.';
  }
  if (!AWS_NUMERIC_ACCOUNT_ID_REGEX.test(input)) {
    return 'AWS account ID must be a 12 digits positive number.';
  }
  return undefined;
};

const validateServiceAccountObject = (obj: GCP): string | undefined => {
  const osdServiceAccountSchema = {
    id: '/osdServiceAccount',
    type: 'object',
    properties: {
      type: {
        const: 'service_account',
      },
      project_id: {
        type: 'string',
      },
      private_key_id: {
        type: 'string',
      },
      private_key: {
        type: 'string',
        pattern: '^-----BEGIN PRIVATE KEY-----\n(.|\n)*\n-----END PRIVATE KEY-----\n$',
      },
      client_email: {
        type: 'string',
        format: 'email',
        pattern: '^osd-ccs-admin@([\\S]*)\\.iam\\.gserviceaccount\\.com$',
      },
      client_id: {
        // maybe numeric?
        type: 'string',
      },
      auth_uri: {
        const: 'https://accounts.google.com/o/oauth2/auth',
      },
      token_uri: {
        type: 'string',
        format: 'uri',
      },
      auth_provider_x509_cert_url: {
        const: 'https://www.googleapis.com/oauth2/v1/certs',
      },
      client_x509_cert_url: {
        type: 'string',
        format: 'uri',
      },
    },
    required: [
      'type',
      'project_id',
      'private_key_id',
      'private_key',
      'client_email',
      'client_id',
      'auth_uri',
      'token_uri',
      'auth_provider_x509_cert_url',
      'client_x509_cert_url',
    ],
  };
  const v = new Validator();
  v.validate(obj, osdServiceAccountSchema, { throwError: true });
  return undefined;
};

const validateGCPServiceAccount = (content: string): string | undefined => {
  try {
    const contentObj = JSON.parse(content);
    return validateServiceAccountObject(contentObj);
  } catch (e) {
    if (e instanceof SyntaxError) {
      return 'Invalid JSON format.';
    }
    if (e instanceof ValidationError) {
      let errorMessage;
      if (e.property.startsWith('instance.')) {
        const errorFieldName = e.property.replace('instance.', '');
        if (errorFieldName === 'client_email' && e.instance.split[0] !== 'osd-ccs-admin') {
          errorMessage = `The field '${errorFieldName}' requires a service account name of 'osd-ccs-admin'.`;
        } else if (e.message.indexOf('does not match pattern') !== -1) {
          errorMessage = `The field '${errorFieldName}' is not in the required format.`;
        } else {
          errorMessage = `The field '${errorFieldName}' ${e.message}`;
        }
      } else {
        errorMessage = e.message;
      }
      return `The provided JSON does not meet the requirements: ${errorMessage}`;
    }
    return undefined;
  }
};

/**
 * Creates a validation function for checking uniqueness within a collection of fields.
 *
 * @param error {string|Error} The error to return from the validation function,
 * in case the validation fails.
 * @param otherValuesSelector {function(string, object): (*[])} A function that
 * selects the other fields (excluding the one currently under validation),
 * and returns their values.
 * It is passed two parameters; the `name` of the field currently under validation,
 * and the `allValues` object.
 *
 * @returns {function(*, object, object, string): string|Error|undefined}
 * A field-level validation function that checks uniqueness.
 */
const createUniqueFieldValidator =
  (error: string, otherValuesSelector: (name: string, allValues: any) => any[]) =>
  (value: unknown, allValues: any, _: unknown, name: string) => {
    const otherValues = otherValuesSelector(name, allValues) ?? [];
    if (otherValues.includes(value)) {
      return error;
    }
    return undefined;
  };

const validateUniqueAZ = createUniqueFieldValidator(
  'Must select 3 different AZs.',
  (currentFieldName: string, allValues: { [key: string]: unknown }) =>
    Object.entries(allValues)
      .filter(([fieldKey]) => fieldKey.startsWith('az_') && fieldKey !== currentFieldName)
      .map(([, fieldValue]) => fieldValue),
);

const validateUniqueNodeLabel = createUniqueFieldValidator(
  'Each label must have a different key.',
  (
    currentFieldName: string,
    allValues: {
      ['node_labels']: {
        key: string;
        value: string;
      }[];
    },
  ) =>
    Object.entries(allValues.node_labels)
      .filter(([fieldKey]) => !currentFieldName.includes(`[${fieldKey}]`))
      .map(([, fieldValue]) => fieldValue.key),
);

const validateValueNotPlaceholder = (placeholder: any) => (value: any) =>
  value !== placeholder ? undefined : 'Field is required';

// AWS VPC validators expect the known vpcs to be passed as prop to the form —
// specifically, the component wrappeed by reduxForm().
//
// (An alternative would be validator factories `vpcs => value => ...` but Field
// unregisters and re-registers the field when `validate` prop changes, which would
// happen constantly without careful memoization.)

type BySubnetID = { [id: string]: AugmentedSubnetwork };

/** Finds all bySubnetID info hashes for AWS VPC subnet fields. */
const awsVPCSubnetInfos = (
  allValues: { [key: string]: string },
  vpcsBySubnetID: BySubnetID,
): AugmentedSubnetwork[] => {
  const infos: AugmentedSubnetwork[] = [];
  Object.entries(allValues).forEach(([fieldName, fieldValue]) => {
    if (fieldName.match(/^(private|public)_subnet_id_/)) {
      if (vpcsBySubnetID[fieldValue]) {
        infos.push(vpcsBySubnetID[fieldValue]);
      }
    }
  });
  return infos;
};

const validateAWSSubnet = (
  value: string,
  allValues: { [key: string]: string },
  formProps: {
    vpcs: {
      fulfilled: boolean;
      data: {
        bySubnetID: BySubnetID;
      };
      region?: string;
    };
    vpcsValid: boolean;
  },
  name: string,
): string | undefined => {
  if (!value) {
    return undefined;
  }

  const { vpcs, vpcsValid } = formProps;
  if (vpcsValid) {
    const subnetInfo = vpcs.data.bySubnetID[value];
    if (!subnetInfo) {
      return `No such subnet in region ${vpcs.region}.`;
    }

    const allInfos = awsVPCSubnetInfos(allValues, vpcs.data.bySubnetID);
    const usedVPCs = new Set(allInfos.map((info) => info.vpc_id));
    if (usedVPCs.size > 1) {
      const vpc = subnetInfo.vpc_name || subnetInfo.vpc_id; // prefer Name tag, not always available
      return `All subnets must belong to the same VPC (provided subnet VPC: ${vpc}).`;
    }

    // private_subnet_id_2, public_subnet_id_2 -> az_2.
    const selectedAZ = allValues[`az_${name.split('_').pop()}`];
    if (!!selectedAZ && subnetInfo.availability_zone !== selectedAZ) {
      return `Provided subnet is from different AZ ${subnetInfo.availability_zone}.`;
    }
  }
  return undefined;
};

const validateAWSSubnetIsPrivate = (
  value: string,
  allValues: unknown,
  formProps: SubnetFormProps,
) => {
  const { vpcs, vpcsValid } = formProps;
  if (vpcsValid) {
    const subnetInfo = vpcs.data.bySubnetID[value];
    if (subnetInfo && subnetInfo.public) {
      return 'Provided subnet is public, should be private.';
    }
  }
  return undefined;
};

const validateAWSSubnetIsPublic = (
  value: string,
  allValues: unknown,
  formProps: SubnetFormProps,
) => {
  const { vpcs, vpcsValid } = formProps;
  if (vpcsValid) {
    const subnetInfo = vpcs.data.bySubnetID[value];
    if (subnetInfo && !subnetInfo.public) {
      return 'Provided subnet is private, should be public.';
    }
  }
  return undefined;
};

const validateGCPSubnet = (value: string): string | undefined => {
  if (!value) {
    return 'Field is required.';
  }
  if (/\s/.test(value)) {
    return 'Name must not contain whitespaces.';
  }
  if (/[^a-z0-9-]/.test(value)) {
    return 'Name should contain only lowercase letters, numbers and hyphens.';
  }
  if (value.length > GCP_SUBNET_NAME_MAXLEN) {
    return `Name may not exceed ${GCP_SUBNET_NAME_MAXLEN} characters.`;
  }
  return undefined;
};

const validateGCPKMSServiceAccount = (value: string): string | undefined => {
  if (!value) {
    return 'Field is required.';
  }
  if (/\s/.test(value)) {
    return 'Field must not contain whitespaces.';
  }
  if (!GCP_KMS_SERVICE_ACCOUNT_REGEX.test(value)) {
    return (
      'Field start with lowercase letter and can only contain hyphens (-), at (@) and dot (.).' +
      'For e.g. "myserviceaccount@myproj.iam.gserviceaccount.com" or "<projectnumericid>-compute@developer.gserviceaccount.com".'
    );
  }
  return undefined;
};

const validateAWSKMSKeyARN = (value: string, region: string): string | undefined => {
  if (!value) {
    return 'Field is required.';
  }

  if (/\s/.test(value)) {
    return 'Value must not contain whitespaces.';
  }

  if (!AWS_KMS_SERVICE_ACCOUNT_REGEX.test(value)) {
    return 'Key provided is not a valid ARN. It should be in the format "arn:aws:kms:<region>:<accountid>:key/<keyid>".';
  }

  const kmsRegion = value.split('kms:')?.pop()?.split(':')[0];
  if (kmsRegion !== region) {
    return 'Your KMS key must contain your selected region.';
  }

  return undefined;
};

const validateHTPasswdPassword = (
  password: string,
):
  | {
      emptyPassword: boolean;
      baseRequirements: boolean;
      uppercase: boolean;
      lowercase: boolean;
      numbersOrSymbols: boolean;
    }
  | undefined => {
  const errors = {
    emptyPassword: false,
    baseRequirements: false,
    uppercase: false,
    lowercase: false,
    numbersOrSymbols: false,
  };
  if (!password || !password.trim()) {
    errors.emptyPassword = true;
    return errors;
  }
  if (
    (password.match(/[^\x20-\x7E]/g) || []).length !== 0 ||
    password.indexOf(' ') !== -1 ||
    password.length < 14
  ) {
    errors.baseRequirements = true;
  }
  if ((password.match(/[A-Z]/g) || []).length === 0) {
    errors.uppercase = true;
  }
  if ((password.match(/[a-z]/g) || []).length === 0) {
    errors.lowercase = true;
  }
  if (/^[a-zA-Z ]+$/.test(password)) {
    errors.numbersOrSymbols = true;
  }
  if (Object.values(errors).every((item) => item === false)) {
    return undefined;
  }
  return errors;
};

const validateHTPasswdUsername = (username: string): string | undefined => {
  if (
    indexOf(username, '%') !== -1 ||
    indexOf(username, ':') !== -1 ||
    indexOf(username, '/') !== -1
  ) {
    return 'Username contains disallowed characters.';
  }
  return undefined;
};

const shouldSkipLabelKeyValidation = (allValues: Record<string, unknown>): boolean => {
  const nodeLabels = (allValues?.node_labels as {
    key: string;
    value: string;
  }[]) ?? [{}];
  // filling the first and only label key/value pair is optional -it serves as a placeholder.
  // if empty, it won't be taken into account in the request payload.
  const [{ key: firstLabelKey, value: firstLabelValue }] = nodeLabels;
  return nodeLabels.length === 1 && !firstLabelKey && !firstLabelValue;
};

const validateLabelKey = (
  key: string,
  allValues: Record<string, unknown>,
  props?: any,
  name?: any,
): string | undefined => {
  if (shouldSkipLabelKeyValidation(allValues)) {
    return undefined;
  }

  return checkLabelKey(key) ?? validateUniqueNodeLabel(key, allValues, props, name);
};

const validateLabelValue = checkLabelValue;

const validators = {
  required,
  acknowledgePrerequisites,
  checkIdentityProviderName,
  checkClusterUUID,
  checkClusterDisplayName,
  checkUserID,
  validateRHITUsername,
  checkBaseDNSDomain,
  cidr,
  awsMachineCidr,
  // gcpMachineCidr, https://issues.redhat.com/browse/HAC-2118
  serviceCidr,
  podCidr,
  disjointSubnets,
  validateRange,
  privateAddress,
  awsSubnetMask,
  disjointFromDockerRange,
  hostPrefix,
  nodes,
  nodesMultiAz,
  validateNumericInput,
  validateLabelKey,
  validateLabelValue,
  checkOpenIDIssuer,
  checkGithubTeams,
  checkRouteSelectors,
  checkDisconnectedConsoleURL,
  checkDisconnectedvCPU,
  checkDisconnectedSockets,
  checkDisconnectedMemCapacity,
  checkDisconnectedNodeCount,
  checkCustomOperatorRolesPrefix,
  AWS_MACHINE_CIDR_MIN,
  AWS_MACHINE_CIDR_MAX_SINGLE_AZ,
  AWS_MACHINE_CIDR_MAX_MULTI_AZ,
  GCP_MACHINE_CIDR_MAX,
  SERVICE_CIDR_MAX,
  POD_NODES_MIN,
  HOST_PREFIX_MIN,
  HOST_PREFIX_MAX,
  MAX_CUSTOM_OPERATOR_ROLES_PREFIX_LENGTH,
};

export {
  required,
  requiredTrue,
  acknowledgePrerequisites,
  atLeastOneRequired,
  checkClusterUUID,
  checkIdentityProviderName,
  checkClusterDisplayName,
  checkUserID,
  validateRHITUsername,
  validateUrl,
  validateCA,
  checkDNSDomain,
  checkClusterConsoleURL,
  checkOpenIDIssuer,
  validateNumericInput,
  checkGithubTeams,
  checkRouteSelectors,
  checkDisconnectedConsoleURL,
  checkDisconnectedvCPU,
  checkDisconnectedSockets,
  checkDisconnectedMemCapacity,
  checkDisconnectedNodeCount,
  validateARN,
  awsNumericAccountID,
  validateGCPServiceAccount,
  validateServiceAccountObject,
  checkMachinePoolName,
  checkCustomOperatorRolesPrefix,
  checkLabels,
  validateUniqueAZ,
  validateValueNotPlaceholder,
  validateAWSSubnet,
  validateAWSSubnetIsPrivate,
  validateAWSSubnetIsPublic,
  validateGCPSubnet,
  validateGCPKMSServiceAccount,
  validateAWSKMSKeyARN,
  validateHTPasswdPassword,
  validateHTPasswdUsername,
  validateUniqueNodeLabel,
  validateLabelKey,
  validateLabelValue,
  createPessimisticValidator,
  clusterNameValidation,
  clusterNameAsyncValidation,
  evaluateClusterNameAsyncValidation,
  asyncValidateClusterName,
  checkLabelKey,
  checkLabelValue,
};

export default validators;
