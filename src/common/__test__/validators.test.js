import validators, {
  required,
  checkIdentityProviderName,
  checkClusterUUID,
  checkClusterConsoleURL,
  checkUserID,
  validateRHITUsername,
  checkOpenIDIssuer,
  checkGithubTeams,
  checkDisconnectedConsoleURL,
  checkDisconnectedSockets,
  checkDisconnectedvCPU,
  checkDisconnectedMemCapacity,
  checkDisconnectedNodeCount,
  validateARN,
  checkLabels,
  checkMachinePoolLabels,
  awsNumericAccountID,
  validateServiceAccountObject,
  validateUniqueAZ,
  validateNumericInput,
  validateAWSSubnet,
  validateAWSSubnetIsPrivate,
  validateAWSSubnetIsPublic,
  validateGCPSubnet,
  validateGCPKMSServiceAccount,
  validateHTPasswdPassword,
  validateHTPasswdUsername,
  clusterNameValidation,
} from '../validators';
import fixtures from './validators.fixtures';
import awsVPCs from '../../../mockdata/api/clusters_mgmt/v1/aws_inquiries/vpcs.json';
import { processAWSVPCs } from '../../components/clusters/CreateOSDPage/CreateOSDWizard/ccsInquiriesReducer';

test('Field is required', () => {
  expect(required()).toBe('Field is required');
  expect(required('        ')).toBe('Field is required');
  expect(required('foo')).toBe(undefined);
});

test('Field is a valid identity provider name', () => {
  expect(checkIdentityProviderName()).toBe('Name is required.');
  expect(checkIdentityProviderName('foo bar')).toBe('Name must not contain whitespaces.');
  expect(checkIdentityProviderName(' ')).toBe('Name must not contain whitespaces.');
  expect(checkIdentityProviderName('foobar ')).toBe('Name must not contain whitespaces.');
  expect(checkIdentityProviderName('foobar$$')).toBe('Name should contain only alphanumeric and dashes');
  expect(checkIdentityProviderName('foo')).toBe(undefined);
});

test('Field is a valid cluster name', () => {
  const numCharsMsg = '1 - 15 characters';
  const alphanumericMsg = 'Consist of lower-case alphanumeric characters, or hyphen (-)';
  const startCharMsg = 'Start with a lower-case alphabetic character';
  const endCharMsg = 'End with a lower-case alphanumeric character';

  expect(clusterNameValidation('')).toEqual([
    { text: numCharsMsg, validated: false },
    { text: alphanumericMsg, validated: false },
    { text: startCharMsg, validated: false },
    { text: endCharMsg, validated: false },
  ]);

  expect(clusterNameValidation('foo.bar')).toEqual([
    { text: numCharsMsg, validated: true },
    { text: alphanumericMsg, validated: false },
    { text: startCharMsg, validated: true },
    { text: endCharMsg, validated: true },
  ]);

  expect(clusterNameValidation('foobarfoobarfoobar')).toEqual([
    { text: numCharsMsg, validated: false },
    { text: alphanumericMsg, validated: true },
    { text: startCharMsg, validated: true },
    { text: endCharMsg, validated: true },
  ]);

  expect(clusterNameValidation('1foobar')).toEqual([
    { text: numCharsMsg, validated: true },
    { text: alphanumericMsg, validated: true },
    { text: startCharMsg, validated: false },
    { text: endCharMsg, validated: true },
  ]);

  expect(clusterNameValidation('foobar-')).toEqual([
    { text: numCharsMsg, validated: true },
    { text: alphanumericMsg, validated: true },
    { text: startCharMsg, validated: true },
    { text: endCharMsg, validated: false },
  ]);

  expect(clusterNameValidation('foo-1bar')).toEqual([
    { text: numCharsMsg, validated: true },
    { text: alphanumericMsg, validated: true },
    { text: startCharMsg, validated: true },
    { text: endCharMsg, validated: true },
  ]);
});

test('Field is a valid UUID', () => {
  expect(checkClusterUUID()).toBe('Cluster ID is required.');
  expect(checkClusterUUID('foo.bar')).toBe('Cluster ID \'foo.bar\' is not a valid UUID.');
  expect(checkClusterUUID('1e479c87-9b83-41c5-854d-e5fec41ce7f8')).toBe(undefined);
});

test('User ID does not contain slash', () => {
  expect(checkUserID('aaaaa/bbbbb')).toBe('User ID cannot contain \'/\'.');
  expect(checkUserID('aaaaa:bbbbb')).toBe('User ID cannot contain \':\'.');
  expect(checkUserID('aaaaa%bbbbb')).toBe('User ID cannot contain \'%\'.');
  expect(checkUserID('~')).toBe('User ID cannot be \'~\'.');
  expect(checkUserID('.')).toBe('User ID cannot be \'.\'.');
  expect(checkUserID('..')).toBe('User ID cannot be \'..\'.');
  expect(checkUserID('')).toBe('User ID cannot be empty.');
  expect(checkUserID('cluster-admin')).toBe('User ID cannot be \'cluster-admin\'.');
  expect(checkUserID('aaaa')).toBe(undefined);
});

test('Username conforms RHIT pattern', () => {
  expect(validateRHITUsername('aaaa')).toBe(undefined);
  expect(validateRHITUsername('aaaaa$bbbbb')).toBe('Username includes illegal symbols');
  expect(validateRHITUsername('aaaaa"bbbbb')).toBe('Username includes illegal symbols');
  expect(validateRHITUsername('aaaaa<bbbbb')).toBe('Username includes illegal symbols');
  expect(validateRHITUsername('aaaaa>bbbbb')).toBe('Username includes illegal symbols');
  expect(validateRHITUsername('aaaaa bbbbb')).toBe('Username includes illegal symbols');
  expect(validateRHITUsername('aaaaa^bbbbb')).toBe('Username includes illegal symbols');
  expect(validateRHITUsername('aaaaa|bbbbb')).toBe('Username includes illegal symbols');
  expect(validateRHITUsername('aaaaa%bbbbb')).toBe('Username includes illegal symbols');
  expect(validateRHITUsername('aaaaa\\bbbbb')).toBe('Username includes illegal symbols');
  expect(validateRHITUsername('aaaaa(bbbbb')).toBe('Username includes illegal symbols');
  expect(validateRHITUsername('aaaaa)bbbbb')).toBe('Username includes illegal symbols');
  expect(validateRHITUsername('aaaaa,bbbbb')).toBe('Username includes illegal symbols');
  expect(validateRHITUsername('aaaaa=bbbbb')).toBe('Username includes illegal symbols');
  expect(validateRHITUsername('aaaaa;bbbbb')).toBe('Username includes illegal symbols');
  expect(validateRHITUsername('aaaaa~bbbbb')).toBe('Username includes illegal symbols');
  expect(validateRHITUsername('aaaaa:bbbbb')).toBe('Username includes illegal symbols');
  expect(validateRHITUsername('aaaaa/bbbbb')).toBe('Username includes illegal symbols');
  expect(validateRHITUsername('aaaaa*bbbbb')).toBe('Username includes illegal symbols');
  expect(validateRHITUsername('aaaaa\rbbbbb')).toBe('Username includes illegal symbols');
  expect(validateRHITUsername('aaaaa\nbbbbb')).toBe('Username includes illegal symbols');
  expect(validateRHITUsername('$$$')).toBe('Username includes illegal symbols');
});

test('Field is a valid DNS domain', () => {
  expect(validators.checkBaseDNSDomain()).toBe('Base DNS domain is required.');
  expect(validators.checkBaseDNSDomain('123.ABC!')).toBe('Base DNS domain \'123.ABC!\' isn\'t valid, must contain at least two valid lower-case DNS labels separated by dots, for example \'mydomain.com\'.');
  expect(validators.checkBaseDNSDomain('foo')).toBe('Base DNS domain \'foo\' isn\'t valid, must contain at least two valid lower-case DNS labels separated by dots, for example \'mydomain.com\'.');
  expect(validators.checkBaseDNSDomain('foo.bar')).toBe(undefined);
  expect(validators.checkBaseDNSDomain('foo.bar.baz')).toBe(undefined);
});

test('Field is valid CIDR range', () => {
  expect(validators.cidr()).toBe(undefined);
  expect(validators.cidr('foo')).toBe('IP address range \'foo\' isn\'t valid CIDR notation. It must follow the RFC-4632 format: \'192.168.0.0/16\'.');
  expect(validators.cidr('192.168.0.0')).toBe('IP address range \'192.168.0.0\' isn\'t valid CIDR notation. It must follow the RFC-4632 format: \'192.168.0.0/16\'.');
  expect(validators.cidr('192.168.0.0/')).toBe('IP address range \'192.168.0.0/\' isn\'t valid CIDR notation. It must follow the RFC-4632 format: \'192.168.0.0/16\'.');
  expect(validators.cidr('192.168.0.0/foo')).toBe('IP address range \'192.168.0.0/foo\' isn\'t valid CIDR notation. It must follow the RFC-4632 format: \'192.168.0.0/16\'.');
  expect(validators.cidr('192.168.0.0/16')).toBe(undefined);
});

test('Field is valid Machine CIDR for AWS', () => {
  expect(validators.awsMachineCidr()).toBe(undefined);
  expect(validators.awsMachineCidr('192.168.0.0/15', { multi_az: 'false' })).toBe('The subnet mask can\'t be lower than \'/16\'.');
  expect(validators.awsMachineCidr('192.168.0.0/16', { multi_az: 'false' })).toBe(undefined);
  expect(validators.awsMachineCidr('192.168.0.0/25', { multi_az: 'false' })).toBe(undefined);
  expect(validators.awsMachineCidr('192.168.0.0/26', { multi_az: 'false' })).toBe('The subnet mask can\'t be higher than \'/25\'.');
  expect(validators.awsMachineCidr('192.168.0.0/15', { multi_az: 'true' })).toBe('The subnet mask can\'t be lower than \'/16\'.');
  expect(validators.awsMachineCidr('192.168.0.0/16', { multi_az: 'true' })).toBe(undefined);
  expect(validators.awsMachineCidr('192.168.0.0/24', { multi_az: 'true' })).toBe(undefined);
  expect(validators.awsMachineCidr('192.168.0.0/25', { multi_az: 'true' })).toBe('The subnet mask can\'t be higher than \'/24\'.');
});

test('Field is valid Machine CIDR for GCP', () => {
  expect(validators.gcpMachineCidr()).toBe(undefined);
  expect(validators.gcpMachineCidr('192.168.0.0/0', { multi_az: 'false' })).toBe(undefined);
  expect(validators.gcpMachineCidr('192.168.0.0/25', { multi_az: 'false' })).toBe('The subnet mask can\'t be higher than \'/23\', which provides up to 23 nodes.');
  expect(validators.gcpMachineCidr('192.168.0.0/0', { multi_az: 'true' })).toBe(undefined);
  expect(validators.gcpMachineCidr('192.168.0.0/25', { multi_az: 'true' })).toBe('The subnet mask can\'t be higher than \'/23\', which provides up to 69 nodes.');
});

test('Field is valid Service CIDR', () => {
  expect(validators.serviceCidr()).toBe(undefined);
  expect(validators.serviceCidr('192.168.0.0/0')).toBe(undefined);
  expect(validators.serviceCidr('192.168.0.0/25')).toBe('The subnet mask can\'t be higher than \'/24\', which provides up to 254 services.');
});

test('Field is valid Pod CIDR', () => {
  expect(validators.podCidr()).toBe(undefined);

  // These are the highest subnet values for the Pod CIDR that still allow for at least 32 nodes
  expect(validators.podCidr('192.168.0.0/17', { network_host_prefix: '/22' })).toBe(undefined); // unreachable
  expect(validators.podCidr('192.168.0.0/18', { network_host_prefix: '/23' })).toBe(undefined);
  expect(validators.podCidr('192.168.0.0/19', { network_host_prefix: '/24' })).toBe(undefined);
  expect(validators.podCidr('192.168.0.0/20', { network_host_prefix: '/25' })).toBe(undefined);
  expect(validators.podCidr('192.168.0.0/21', { network_host_prefix: '/26' })).toBe(undefined);
  expect(validators.podCidr('192.168.0.0/22', { network_host_prefix: '/27' })).toBe('The subnet mask can\'t be higher than /21.');

  // With host prefix /23, pod subnet needs to be at most /18
  expect(validators.podCidr('192.168.0.0/17', { network_host_prefix: '/23' })).toBe(undefined);
  expect(validators.podCidr('192.168.0.0/18', { network_host_prefix: '/23' })).toBe(undefined);
  expect(validators.podCidr('192.168.0.0/19', { network_host_prefix: '/23' })).toBe('The subnet mask of /19 does not allow for enough nodes. Try changing the host prefix or the pod subnet range.');

  // With host prefix /24, pod subnet needs to be at most /19
  expect(validators.podCidr('192.168.0.0/19', { network_host_prefix: '/24' })).toBe(undefined);
  expect(validators.podCidr('192.168.0.0/20', { network_host_prefix: '/24' })).toBe('The subnet mask of /20 does not allow for enough nodes. Try changing the host prefix or the pod subnet range.');

  // With host prefix /25, pod subnet needs to be at most /20
  expect(validators.podCidr('192.168.0.0/20', { network_host_prefix: '/25' })).toBe(undefined);
  expect(validators.podCidr('192.168.0.0/21', { network_host_prefix: '/25' })).toBe('The subnet mask of /21 does not allow for enough nodes. Try changing the host prefix or the pod subnet range.');

  // With host prefix /26, pod subnet needs to be at most /21
  expect(validators.podCidr('192.168.0.0/21', { network_host_prefix: '/26' })).toBe(undefined);
  expect(validators.podCidr('192.168.0.0/22', { network_host_prefix: '/26' })).toBe('The subnet mask can\'t be higher than /21.');
});

test('Field is a private IP address', () => {
  expect(validators.privateAddress()).toBe(undefined);
  expect(validators.privateAddress('10.0.0.0/11')).toBe(undefined);
  expect(validators.privateAddress('10.255.255.255/8')).toBe(undefined);
  expect(validators.privateAddress('10.255.255.255/7')).toBe('Range is not private.');
  expect(validators.privateAddress('172.16.0.0/12')).toBe(undefined);
  expect(validators.privateAddress('172.31.77.250/15')).toBe(undefined);
  expect(validators.privateAddress('172.31.255.255/11')).toBe('Range is not private.');
  expect(validators.privateAddress('192.168.98.4/18')).toBe(undefined);
  expect(validators.privateAddress('192.168.255.255/20')).toBe(undefined);
  expect(validators.privateAddress('192.168.79.24/15')).toBe('Range is not private.');
  expect(validators.privateAddress('67.25.66.98/15')).toBe('Range is not private.');
});

test('Field does not share subnets with other fields', () => {
  expect(validators.disjointSubnets('network_machine_cidr')(null, {})).toBe(undefined);
  expect(validators.disjointSubnets('network_machine_cidr')(
    '190.231.125.47/12',
    {
      network_service_cidr: '17.26.43.56/21',
      network_pod_cidr: '12.124.23.41',
    },
  )).toBe(undefined);

  expect(validators.disjointSubnets('network_machine_cidr')(
    '190.231.125.47/12',
    {
      network_service_cidr: '190.231.43.56/11',
      network_pod_cidr: '12.124.23.41',
    },
  )).toBe('This subnet overlaps with the subnet in the Service CIDR field.');

  expect(validators.disjointSubnets('network_machine_cidr')(
    '190.231.125.47/12',
    {
      network_service_cidr: '12.124.23.41',
      network_pod_cidr: '190.230.45.9/11',
    },
  )).toBe('This subnet overlaps with the subnet in the Pod CIDR field.');

  expect(validators.disjointSubnets('network_machine_cidr')(
    '190.231.125.47/12',
    {
      network_service_cidr: '190.229.251.44/14',
      network_pod_cidr: '190.230.45.9/11',
    },
  )).toBe('This subnet overlaps with the subnets in the Service CIDR, Pod CIDR fields.');
});

test('Field is an IP address with subnet mask between 16-28', () => {
  expect(validators.awsSubnetMask('network_machine_cidr_single_az')()).toBe(undefined);
  expect(validators.awsSubnetMask('network_machine_cidr_single_az')('190.68.89.250/17')).toBe(undefined);
  expect(validators.awsSubnetMask('network_machine_cidr_single_az')('190.68.89.250/10')).toBe('Subnet mask must be between /16 and /25.');
  expect(validators.awsSubnetMask('network_machine_cidr_single_az')('190.68.89.250/16')).toBe(undefined);
  expect(validators.awsSubnetMask('network_machine_cidr_single_az')('190.68.89.250/28')).toBe('Subnet mask must be between /16 and /25.');

  expect(validators.awsSubnetMask('network_machine_cidr_multi_az')()).toBe(undefined);
  expect(validators.awsSubnetMask('network_machine_cidr_multi_az')('190.68.89.250/17')).toBe(undefined);
  expect(validators.awsSubnetMask('network_machine_cidr_multi_az')('190.68.89.250/10')).toBe('Subnet mask must be between /16 and /24.');
  expect(validators.awsSubnetMask('network_machine_cidr_multi_az')('190.68.89.250/16')).toBe(undefined);
  expect(validators.awsSubnetMask('network_machine_cidr_multi_az')('190.68.89.250/28')).toBe('Subnet mask must be between /16 and /24.');

  expect(validators.awsSubnetMask('network_service_cidr')()).toBe(undefined);
  expect(validators.awsSubnetMask('network_service_cidr')('190.68.89.250/17')).toBe(undefined);
  expect(validators.awsSubnetMask('network_service_cidr')('190.68.89.250/24')).toBe(undefined);
  expect(validators.awsSubnetMask('network_service_cidr')('190.68.89.250/28')).toBe('Subnet mask must be between /1 and /24.');
});

test('Field is an IP address that does not overlap with 172.17.0.0/16, reserved for docker', () => {
  expect(validators.disjointFromDockerRange()).toBe(undefined);
  expect(validators.disjointFromDockerRange('172.17.0.0/16')).toBe('Selected range must not overlap with 172.17.0.0/16.');
  expect(validators.disjointFromDockerRange('172.17.0.0/15')).toBe('Selected range must not overlap with 172.17.0.0/16.');
  expect(validators.disjointFromDockerRange('172.17.80.0/17')).toBe('Selected range must not overlap with 172.17.0.0/16.');
  expect(validators.disjointFromDockerRange('90.90.90.90/20')).toBe(undefined);
});

test('Field is an address the corresponds with the first host in its subnet', () => {
  expect(validators.validateRange()).toBe(undefined);
  expect(validators.validateRange('192.148.30.71/16')).toBe('This is not a subnet address. The subnet prefix is inconsistent with the subnet mask.');
  // original 111111111[9]00000000000000000000000[23]
  expect(validators.validateRange('255.128.0.0/10')).toBe(undefined);
  // original 111111111[9]00000100000000000000000 masked 11111111100000000000000000000000
  expect(validators.validateRange('255.130.0.0/10')).toBe('This is not a subnet address. The subnet prefix is inconsistent with the subnet mask.');
});

test('Field is valid subnet mask', () => {
  expect(validators.hostPrefix()).toBe(undefined);
  expect(validators.hostPrefix('/22')).toBe('The subnet mask can\'t be lower than \'/23\', which provides up to 510 Pod IP addresses.');
  expect(validators.hostPrefix('/23')).toBe(undefined);
  expect(validators.hostPrefix('/26')).toBe(undefined);
  expect(validators.hostPrefix('/27')).toBe('The subnet mask can\'t be higher than \'/26\', which provides up to 62 Pod IP addresses.');
  expect(validators.hostPrefix('/33')).toBe('The value \'/33\' isn\'t a valid subnet mask. It must follow the RFC-4632 format: \'/16\'.');
  expect(validators.hostPrefix('32')).toBe('The subnet mask can\'t be higher than \'/26\', which provides up to 62 Pod IP addresses.');
  expect(validators.hostPrefix('/foo')).toBe('The value \'/foo\' isn\'t a valid subnet mask. It must follow the RFC-4632 format: \'/16\'.');
  expect(validators.hostPrefix('foo')).toBe('The value \'foo\' isn\'t a valid subnet mask. It must follow the RFC-4632 format: \'/16\'.');
  expect(validators.hostPrefix('/')).toBe('The value \'/\' isn\'t a valid subnet mask. It must follow the RFC-4632 format: \'/16\'.');
  expect(validators.hostPrefix('/0')).toBe('The subnet mask can\'t be lower than \'/23\', which provides up to 510 Pod IP addresses.');
  expect(validators.hostPrefix('0')).toBe('The subnet mask can\'t be lower than \'/23\', which provides up to 510 Pod IP addresses.');
  expect(validators.hostPrefix('/-1')).toBe('The value \'/-1\' isn\'t a valid subnet mask. It must follow the RFC-4632 format: \'/16\'.');
  expect(validators.hostPrefix('-1')).toBe('The value \'-1\' isn\'t a valid subnet mask. It must follow the RFC-4632 format: \'/16\'.');
});

test('Field is valid node count', () => {
  expect(validators.nodes(3, { value: 4, validationMsg: 'At least 4 nodes are required.' })).toBe('At least 4 nodes are required.');
  expect(validators.nodes(4, { value: 4, validationMsg: 'At least 4 nodes are required.' })).toBe(undefined);
  expect(validators.nodes(5, { value: 4, validationMsg: 'At least 4 nodes are required.' })).toBe(undefined);
  expect(validators.nodes(4, { value: 9, validationMsg: 'At least 9 nodes are required for multiple availability zone cluster.' })).toBe('At least 9 nodes are required for multiple availability zone cluster.');
  expect(validators.nodes(9, { value: 9, validationMsg: 'At least 9 nodes are required for multiple availability zone cluster.' })).toBe(undefined);
  expect(validators.nodes(-1, { value: 4, validationMsg: 'At least 4 nodes are required.' })).toBe('At least 4 nodes are required.');
  expect(validators.nodes('aaa', { value: 4, validationMsg: 'At least 4 nodes are required.' })).toBe('\'aaa\' is not a valid number of nodes.');
});

test('Field is valid node count for OCP cluster', () => {
  expect(validators.nodes(0, { value: 0 }, 250)).toBe(undefined);
  expect(validators.nodes(250, { value: 0 }, 250)).toBe(undefined);
  expect(validators.nodes(-1, { value: 0 }, 250)).toBe('The minimum number of nodes is 0.');
  expect(validators.nodes(251, { value: 0 }, 250)).toBe('Maximum number allowed is 250.');
  expect(validators.nodes(250, { value: 0 })).toBe('Maximum number allowed is 180.');
});

test('Field is valid node count for multi AZ', () => {
  expect(validators.nodesMultiAz(3)).toBe(undefined);
  expect(validators.nodesMultiAz(4)).toBe('Number of nodes must be multiple of 3 for Multi AZ cluster.');
  expect(validators.nodesMultiAz(5)).toBe('Number of nodes must be multiple of 3 for Multi AZ cluster.');
  expect(validators.nodesMultiAz(6)).toBe(undefined);
});

test('Field is a valid console URL', () => {
  expect(checkClusterConsoleURL()).toBe(undefined);
  expect(checkClusterConsoleURL('', true)).toBe('Cluster console URL should not be empty');
  expect(checkClusterConsoleURL('http://www.example.com')).toBe(undefined);
  expect(checkClusterConsoleURL('https://console-openshift-console.apps.example.com/')).toBe(undefined);
  expect(checkClusterConsoleURL('www.example.hey/hey')).toBe('The URL should include the scheme prefix (http://, https://)');
  expect(checkClusterConsoleURL('ftp://hello.com')).toBe('The URL should include the scheme prefix (http://, https://)');
  expect(checkClusterConsoleURL('http://example.com\noa')).toBe('Invalid URL');
  expect(checkClusterConsoleURL('http://www.example:55815.com')).toBe('Invalid URL');
  expect(checkClusterConsoleURL('https://www-whatever.apps.example.co.uk/')).toBe(undefined);
  expect(checkClusterConsoleURL('http://www.example.com:foo')).toBe('Invalid URL');
  expect(checkClusterConsoleURL('http://www.example.com....')).toBe('Invalid URL');
  expect(checkClusterConsoleURL('http://blog.example.com')).toBe(undefined);
  expect(checkClusterConsoleURL('http://255.255.255.255')).toBe(undefined);
  expect(checkClusterConsoleURL('http://www.site.com:8008')).toBe(undefined);
  expect(checkClusterConsoleURL('http://www.example.com/product')).toBe(undefined);
  expect(checkClusterConsoleURL('example.com/')).toBe('The URL should include the scheme prefix (http://, https://)');
  expect(checkClusterConsoleURL('www.example.com')).toBe('The URL should include the scheme prefix (http://, https://)');
  expect(checkClusterConsoleURL('http://www.example.com#up')).toBe('The URL must not include a query string (?) or fragment (#)');
  expect(checkClusterConsoleURL('http://www.example.com/products?id=1&page=2')).toBe('The URL must not include a query string (?) or fragment (#)');
  expect(checkClusterConsoleURL('255.255.255.255')).toBe('The URL should include the scheme prefix (http://, https://)');
  expect(checkClusterConsoleURL('http://invalid.com/perl.cgi?key=')).toBe('The URL must not include a query string (?) or fragment (#)');
});

test('Field is a valid issuer', () => {
  expect(checkOpenIDIssuer()).toBe('Issuer URL is required.');
  expect(checkOpenIDIssuer('http://www.example.com')).toBe('Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('https://example.com/')).toBe(undefined);
  expect(checkOpenIDIssuer('...example....')).toBe('Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('https://???')).toBe('Invalid URL');
  expect(checkOpenIDIssuer('www.example.hey/hey')).toBe('Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('ftp://hello.com')).toBe('Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('https://www.example:55815.com')).toBe('Invalid URL');
  expect(checkOpenIDIssuer('https://www-whatever.apps.example.co.uk/')).toBe(undefined);
  expect(checkOpenIDIssuer('https://www.example.com:foo')).toBe('Invalid URL');
  expect(checkOpenIDIssuer('https://blog.example.com')).toBe(undefined);
  expect(checkOpenIDIssuer('https://255.255.255.255')).toBe(undefined);
  expect(checkOpenIDIssuer('https://www.site.com:8008')).toBe(undefined);
  expect(checkOpenIDIssuer('https://www.example.com/product')).toBe(undefined);
  expect(checkOpenIDIssuer('example.com/')).toBe('Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('www.example.com')).toBe('Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('https://www.example.com#up')).toBe('The URL must not include a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('https://www.example.com/products?id=1&page=2')).toBe('The URL must not include a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('255.255.255.255')).toBe('Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('https://invalid.com/perl.cgi?key=')).toBe('The URL must not include a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('https://login.openidprovider.com/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/v2.0/')).toBe(undefined);
  expect(checkOpenIDIssuer('https://www.example.com#')).toBe('The URL must not include a query string (?) or fragment (#)');
});

test('Field contains a numeric string', () => {
  expect(validateNumericInput()).toBe(undefined);
  expect(validateNumericInput('8.8', { allowDecimal: true })).toBe(undefined);
  expect(validateNumericInput('8.8')).toBe('Input must be an integer.');
  expect(validateNumericInput('-10')).toBe('Input must be a positive number.');
  expect(validateNumericInput('-10', { allowNeg: true })).toBe(undefined);
  expect(validateNumericInput('asdf')).toBe('Input must be a number.');
  expect(validateNumericInput('0', { allowZero: true })).toBe(undefined);
  expect(validateNumericInput('1000', { max: 999 })).toBe('Input cannot be more than 999.');
  expect(validateNumericInput('999', { max: 999 })).toBe(undefined);
  expect(validateNumericInput(Number.MAX_SAFE_INTEGER)).toBe(undefined);
  expect(validateNumericInput('2', { min: 3 })).toBe('Input cannot be less than 3.');
});

test('Field is a valid list of github teams', () => {
  expect(checkGithubTeams()).toBe(undefined);
  expect(checkGithubTeams('org/team')).toBe(undefined);
  expect(checkGithubTeams('org1/team1,org2/team2')).toBe(undefined);
  expect(checkGithubTeams('org1/team1,,org2/team2')).toBe("Each team must be of format 'org/team'.");
  expect(checkGithubTeams('org1/team1, org2/team2')).toBe('Organization must not contain whitespaces.');
  expect(checkGithubTeams('org1/team1,team2')).toBe("Each team must be of format 'org/team'.");
  expect(checkGithubTeams('/team')).toBe("Each team must be of format 'org/team'.");
  expect(checkGithubTeams('org/')).toBe("Each team must be of format 'org/team'.");
  expect(checkGithubTeams('org /team')).toBe('Organization must not contain whitespaces.');
  expect(checkGithubTeams('org/team a')).toBe('Team must not contain whitespaces.');
  expect(checkGithubTeams('team')).toBe("Each team must be of format 'org/team'.");
  expect(checkGithubTeams('team2,')).toBe("Each team must be of format 'org/team'.");
  expect(checkGithubTeams('team2,/')).toBe("Each team must be of format 'org/team'.");
});

test('Field is a valid disconnected console URL', () => {
  expect(checkDisconnectedConsoleURL()).toBe(undefined);
  expect(checkDisconnectedConsoleURL('')).toBe(undefined);
  expect(checkDisconnectedConsoleURL('http://www.example.com')).toBe(undefined);
  expect(checkDisconnectedConsoleURL('https://console-openshift-console.apps.example.com/')).toBe(undefined);
  expect(checkDisconnectedConsoleURL('www.example.hey/hey')).toBe('The URL should include the scheme prefix (http://, https://)');
  expect(checkDisconnectedConsoleURL('ftp://hello.com')).toBe('The URL should include the scheme prefix (http://, https://)');
  expect(checkDisconnectedConsoleURL('http://example.com\noa')).toBe('Invalid URL');
  expect(checkDisconnectedConsoleURL('http://www.example:55815.com')).toBe('Invalid URL');
  expect(checkDisconnectedConsoleURL('https://www-whatever.apps.example.co.uk/')).toBe(undefined);
  expect(checkDisconnectedConsoleURL('http://www.example.com:foo')).toBe('Invalid URL');
  expect(checkDisconnectedConsoleURL('http://www.example.com....')).toBe('Invalid URL');
  expect(checkDisconnectedConsoleURL('http://blog.example.com')).toBe(undefined);
  expect(checkDisconnectedConsoleURL('http://255.255.255.255')).toBe(undefined);
  expect(checkDisconnectedConsoleURL('http://www.site.com:8008')).toBe(undefined);
  expect(checkDisconnectedConsoleURL('http://www.example.com/product')).toBe(undefined);
  expect(checkDisconnectedConsoleURL('example.com/')).toBe('The URL should include the scheme prefix (http://, https://)');
  expect(checkDisconnectedConsoleURL('www.example.com')).toBe('The URL should include the scheme prefix (http://, https://)');
  expect(checkDisconnectedConsoleURL('http://www.example.com#up')).toBe('The URL must not include a query string (?) or fragment (#)');
  expect(checkDisconnectedConsoleURL('http://www.example.com/products?id=1&page=2')).toBe('The URL must not include a query string (?) or fragment (#)');
  expect(checkDisconnectedConsoleURL('255.255.255.255')).toBe('The URL should include the scheme prefix (http://, https://)');
  expect(checkDisconnectedConsoleURL('http://invalid.com/perl.cgi?key=')).toBe('The URL must not include a query string (?) or fragment (#)');
});

test('Field contains a valid number of vCPUs', () => {
  expect(checkDisconnectedvCPU()).toBe(undefined);
  expect(checkDisconnectedvCPU('8.8')).toBe('Input must be an integer.');
  expect(checkDisconnectedvCPU('-10')).toBe('Input must be a positive number.');
  expect(checkDisconnectedvCPU('asdf')).toBe('Input must be a number.');
  expect(checkDisconnectedvCPU('0')).toBe('Input must be a positive number.');
  expect(checkDisconnectedvCPU('18000')).toBe('Input cannot be more than 16000.');
  expect(checkDisconnectedvCPU('16000')).toBe(undefined);
  expect(checkDisconnectedvCPU(Number.MAX_SAFE_INTEGER)).toBe('Input cannot be more than 16000.');
});

test('Field contains a valid number of sockets', () => {
  expect(checkDisconnectedSockets()).toBe(undefined);
  expect(checkDisconnectedSockets('8.8')).toBe('Input must be an integer.');
  expect(checkDisconnectedSockets('-10')).toBe('Input must be a positive number.');
  expect(checkDisconnectedSockets('asdf')).toBe('Input must be a number.');
  expect(checkDisconnectedSockets('0')).toBe('Input must be a positive number.');
  expect(checkDisconnectedSockets('3000')).toBe('Input cannot be more than 2000.');
  expect(checkDisconnectedSockets('1999')).toBe(undefined);
  expect(checkDisconnectedSockets(Number.MAX_SAFE_INTEGER)).toBe('Input cannot be more than 2000.');
});

test('Field contains a valid number of memory', () => {
  expect(checkDisconnectedMemCapacity()).toBe(undefined);
  expect(checkDisconnectedMemCapacity('8.8')).toBe(undefined);
  expect(checkDisconnectedMemCapacity('-10')).toBe('Input must be a positive number.');
  expect(checkDisconnectedMemCapacity('asdf')).toBe('Input must be a number.');
  expect(checkDisconnectedMemCapacity('0')).toBe('Input must be a positive number.');
  expect(checkDisconnectedMemCapacity('512000')).toBe('Input cannot be more than 256000.');
  expect(checkDisconnectedMemCapacity('128000')).toBe(undefined);
  expect(checkDisconnectedMemCapacity(Number.MAX_SAFE_INTEGER)).toBe('Input cannot be more than 256000.');
});

test('Field is valid number of compute nodes for disconnected cluster', () => {
  expect(checkDisconnectedNodeCount()).toBe('Input must be a number.');
  expect(checkDisconnectedNodeCount('')).toBe(undefined);
  expect(checkDisconnectedNodeCount('asdf')).toBe('Input must be a number.');
  expect(checkDisconnectedNodeCount(0)).toBe(undefined);
  expect(checkDisconnectedNodeCount(-1)).toBe('The minimum number of nodes is 0.');
  expect(checkDisconnectedNodeCount(250)).toBe(undefined);
  expect(checkDisconnectedNodeCount(251)).toBe('Maximum number allowed is 250.');
  expect(checkDisconnectedNodeCount(Number.MAX_SAFE_INTEGER)).toBe('Maximum number allowed is 250.');
});

test('Field is a valid ARN', () => {
  expect(validateARN('arn:aws:iam::012345678901:user/richard')).toBe(undefined);
  expect(validateARN('arn:aws:iam::012345678901:group/sda')).toBe(undefined);
  expect(validateARN('arn:aws:iam::012345678901:group/s da')).toBe('Value must not contain whitespaces.');
  expect(validateARN('arn:aws:iam::0123456789:user/richard')).toBe('ARN value should be in the format arn:aws:iam::123456789012:user/name.');
  expect(validateARN('arn:aws:iam:0123456789:user/richard')).toBe('ARN value should be in the format arn:aws:iam::123456789012:user/name.');
  expect(validateARN('0123456789:user/richard')).toBe('ARN value should be in the format arn:aws:iam::123456789012:user/name.');
});

test('Field is a valid key value pair', () => {
  const validKeyError = "A qualified key must consist of alphanumeric characters, '-' or '_' and must start and end with an alphanumeric character.";
  const validValueError = "A qualified value must consist of alphanumeric characters, '-' or '_' and must start and end with an alphanumeric character.";
  const maxLenKeyError = 'Length of label key name must be less or equal to 63';
  const maxLenValueError = 'Length of label value must be less or equal to 63';
  const longKeyStr = 'ffffffffffffffffffffffffffffffffkkkkddddddddddddddddddddffffffff=val';
  const longValStr = 'key=ffffffffffffffffffffffffffffffffkkkkddddddddddddddddddddffffffff';
  const prefixError = 'Prefix must be a DNS subdomain: a series of DNS labels separated by dots (.)';

  expect(checkLabels('foo=bar')).toBe(undefined);
  expect(checkLabels('fOo=BAr')).toBe(undefined);
  expect(checkLabels('foo=3')).toBe(undefined);
  expect(checkLabels('foo=bar,foo=3')).toBe(undefined);
  expect(checkLabels('fo_o=ba-r')).toBe(undefined);
  expect(checkLabels('fo-o=ba_r')).toBe(undefined);
  expect(checkLabels('键=值')).toBe(validKeyError);
  expect(checkLabels('foo:bar')).toBe(validKeyError);
  expect(checkLabels('foo')).toBe(validValueError);
  expect(checkLabels('_foo=bar')).toBe(validKeyError);
  expect(checkLabels('foo-=bar')).toBe(validKeyError);
  expect(checkLabels('foo=-bar')).toBe(validValueError);
  expect(checkLabels('foo=bar_')).toBe(validValueError);
  expect(checkLabels('foo=bar_')).toBe(validValueError);
  expect(checkLabels(longValStr)).toBe(maxLenValueError);
  expect(checkLabels(longKeyStr)).toBe(maxLenKeyError);
  expect(checkLabels('prefixError/foo')).toBe(prefixError);
  expect(checkLabels(`some.prefix/${longKeyStr}`)).toBe(maxLenKeyError);
});

test('Check machine pool labels', () => {
  const invalidLabels = [
    'machine.openshift.io/cluster-api-machine-role=master',
    'machine.openshift.io/cluster-api-machine-role=infra',
    'machine.openshift.io/cluster-api-machine-type=master',
    'machine.openshift.io/cluster-api-machine-type=infra',
  ];

  expect(checkMachinePoolLabels(invalidLabels[0])).toBe(`${invalidLabels[0]} is not a valid label`);
  expect(checkMachinePoolLabels(invalidLabels[1])).toBe(`${invalidLabels[1]} is not a valid label`);
  expect(checkMachinePoolLabels(invalidLabels[2])).toBe(`${invalidLabels[2]} is not a valid label`);
  expect(checkMachinePoolLabels(invalidLabels[3])).toBe(`${invalidLabels[3]} is not a valid label`);
});

test('awsNumericAccountID', () => {
  const errStr = 'AWS account ID must be a 12 digits positive number.';
  expect(awsNumericAccountID()).toBe('AWS account ID is required.');
  expect(awsNumericAccountID('1')).toBe(errStr);
  expect(awsNumericAccountID('123456789')).toBe(errStr);
  expect(awsNumericAccountID('1e5')).toBe(errStr);
  expect(awsNumericAccountID('11111111122222222aaaaaaaaaa')).toBe(errStr);
  expect(awsNumericAccountID('-12345678901')).toBe(errStr);
  expect(awsNumericAccountID('123456789012')).toBe(undefined);
});

test('GCP service account JSON', () => {
  fixtures.GCPServiceAccounts.forEach((item) => {
    const { expectedError, testObj } = item;
    if (expectedError) {
      try {
        validateServiceAccountObject(testObj);
      } catch (e) {
        expect(e.property).toBe(expectedError.property);
        expect(e.message).toBe(expectedError.message);
      }
    } else {
      expect(validateServiceAccountObject(testObj)).toBe(undefined);
    }
  });
});

describe('AWS Subnet', () => {
  test('Unique AZs', () => {
    const AllValues = {
      az_0: 'a',
      az_1: 'b',
      az_2: 'c',
    };
    expect(validateUniqueAZ(AllValues.az_0, AllValues, null, 'az_0')).toBe(undefined);
    AllValues.az_0 = 'b';
    expect(validateUniqueAZ(AllValues.az_0, AllValues, null, 'az_0')).toBe('Must select 3 different AZs.');
    expect(validateUniqueAZ(AllValues.az_1, AllValues, null, 'az_1')).toBe('Must select 3 different AZs.');
    expect(validateUniqueAZ(AllValues.az_2, AllValues, null, 'az_2')).toBe(undefined);
    AllValues.az_1 = 'd';
    expect(validateUniqueAZ(AllValues.az_0, AllValues, null, 'az_0')).toBe(undefined);
    AllValues.az_0 = 'd';
    expect(validateUniqueAZ(AllValues.az_0, AllValues, null, 'az_0')).toBe('Must select 3 different AZs.');
  });

  const formProps = { vpcs: { fulfilled: true, data: processAWSVPCs(awsVPCs) }, vpcsValid: true };
  const goodValues = {
    az_0: 'us-east-1d',
    private_subnet_id_0: 'subnet-00b3753ab2dd892ac', // All from vpc-08b6f0901ba35262d.
    public_subnet_id_0: 'subnet-0703ec90283d1fd6b',
    az_1: 'us-east-1e',
    private_subnet_id_1: 'subnet-0735da52d658da28b',
    public_subnet_id_1: 'subnet-09404f4fc139bd94e',
    az_2: 'us-east-1f',
    private_subnet_id_2: 'subnet-00327948731118662',
    public_subnet_id_2: 'subnet-09ad4ef49f2e29996',
  };

  test('private/public', () => {
    const validatePP = allValues => (
      validateAWSSubnetIsPrivate(allValues.private_subnet_id_0, allValues, formProps, 'private_subnet_id_0')
      || validateAWSSubnetIsPrivate(allValues.private_subnet_id_1, allValues, formProps, 'private_subnet_id_1')
      || validateAWSSubnetIsPrivate(allValues.private_subnet_id_2, allValues, formProps, 'private_subnet_id_2')
      || validateAWSSubnetIsPublic(allValues.public_subnet_id_0, allValues, formProps, 'public_subnet_id_0')
      || validateAWSSubnetIsPublic(allValues.public_subnet_id_1, allValues, formProps, 'public_subnet_id_1')
      || validateAWSSubnetIsPublic(allValues.public_subnet_id_2, allValues, formProps, 'public_subnet_id_2')
    );
    expect(validatePP(goodValues)).toBe(undefined);
    const publicValues = { ...goodValues, private_subnet_id_1: goodValues.public_subnet_id_2 };
    expect(validatePP(publicValues)).toBe('Provided subnet is public, should be private.');
    const privateValues = { ...goodValues, public_subnet_id_1: goodValues.private_subnet_id_2 };
    expect(validatePP(privateValues)).toBe('Provided subnet is private, should be public.');
  });

  const validate = allValues => (
    validateAWSSubnet(allValues.private_subnet_id_0, allValues, formProps, 'private_subnet_id_0')
    || validateAWSSubnet(allValues.private_subnet_id_1, allValues, formProps, 'private_subnet_id_1')
    || validateAWSSubnet(allValues.private_subnet_id_2, allValues, formProps, 'private_subnet_id_2')
    || validateAWSSubnet(allValues.public_subnet_id_0, allValues, formProps, 'public_subnet_id_0')
    || validateAWSSubnet(allValues.public_subnet_id_1, allValues, formProps, 'public_subnet_id_1')
    || validateAWSSubnet(allValues.public_subnet_id_2, allValues, formProps, 'public_subnet_id_2')
  );

  test('unknown subnet', () => {
    expect(validate({ ...goodValues, private_subnet_id_1: 'nnn' })).toContain('No such subnet');
  });

  test('same VPC', () => {
    const values2 = {
      private_subnet_id_0: 'subnet-0189e68d3126435fb', // Both from vpc-05bb9f093feffe176.
      public_subnet_id_0: 'subnet-0c2880e587449df55',
    };
    expect(validate(values2)).toBe(undefined);
    const values = {
      private_subnet_id_0: 'subnet-0189e68d3126435fb', // From 3 different VPCs.
      private_subnet_id_1: 'subnet-0d3a4a32658ee415a',
      private_subnet_id_2: 'subnet-id-without-Name',
    };
    expect(validateAWSSubnet(values.private_subnet_id_0, values, formProps, 'private_subnet_id_0'))
      .toContain('vpc-05bb9f093feffe176');
    expect(validateAWSSubnet(values.private_subnet_id_1, values, formProps, 'private_subnet_id_1'))
      .toContain('SDA-5333-test-new-API-returning-both-name-and-id');
    expect(validateAWSSubnet(values.private_subnet_id_2, values, formProps, 'private_subnet_id_2'))
      .toContain('SDA-5333-test-new-API-returning-only-id-for-VPC-without-Name-tag');
  });

  test('AZ matching', () => {
    expect(validate(goodValues)).toBe(undefined);
    const values1 = { ...goodValues, private_subnet_id_2: goodValues.private_subnet_id_1 };
    expect(validate(values1)).toContain('us-east-1e');
    const values2 = { ...goodValues, public_subnet_id_0: goodValues.public_subnet_id_2 };
    expect(validate(values2)).toContain('us-east-1f');
    expect(validate({ ...values2, az_0: '' })).toBe(undefined);
  });
});

test('GCP Subnet', () => {
  const value = 'testnameeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
  expect(validateGCPSubnet()).toBe('Field is required.');
  expect(validateGCPSubnet('Subnet Name')).toBe('Name must not contain whitespaces.');
  expect(validateGCPSubnet('Subet$$')).toBe('Name should contain only lowercase letters, numbers and hyphens.');
  expect(validateGCPSubnet(value)).toBe('Name may not exceed 63 characters.');
});

test('GCP KMSService Account', () => {
  const inValidValueTest1 = '9%%#$#$-compute@developer.gserviceaccount.com';
  const inValidValueTest2 = '100000000000-compute@developer.gserviceaccount.commmm';

  const validValueTest1 = '100000000000-compute@developer.gserviceaccount.com';
  const validValueTest2 = 'myserviceaccount@exampleproj-3.iam.gserviceaccount.com';

  const expectedMsg = 'Field start with lowercase letter and can only contain hyphens (-), at (@) and dot (.).'
  + 'For e.g. "myserviceaccount@myproj.iam.gserviceaccount.com" or "<projectnumericid>-compute@developer.gserviceaccount.com".';

  expect(validateGCPKMSServiceAccount()).toBe('Field is required.');
  expect(validateGCPKMSServiceAccount('service account')).toBe('Field must not contain whitespaces.');
  expect(validateGCPKMSServiceAccount(inValidValueTest1)).toBe(expectedMsg);
  expect(validateGCPKMSServiceAccount(inValidValueTest2)).toBe(expectedMsg);
  expect(validateGCPKMSServiceAccount(validValueTest1)).toBe(undefined);
  expect(validateGCPKMSServiceAccount(validValueTest2)).toBe(undefined);
});

test('HTPasswd password', () => {
  expect(validateHTPasswdPassword('SOMETHINGsomething1')).toBeUndefined();
  expect(validateHTPasswdPassword('something')).toMatchObject({
    emptyPassword: false,
    baseRequirements: true,
    uppercase: true,
    lowercase: false,
    numbersOrSymbols: true,
  });
  expect(validateHTPasswdPassword('somethingsomething')).toMatchObject({
    emptyPassword: false,
    baseRequirements: false,
    uppercase: true,
    lowercase: false,
    numbersOrSymbols: true,
  });
  expect(validateHTPasswdPassword('SOMETHINGSOMEHING')).toMatchObject({
    emptyPassword: false,
    baseRequirements: false,
    uppercase: false,
    lowercase: true,
    numbersOrSymbols: true,
  });
  expect(validateHTPasswdPassword('SOMETHINGsomething')).toMatchObject({
    emptyPassword: false,
    baseRequirements: false,
    uppercase: false,
    lowercase: false,
    numbersOrSymbols: true,
  });
  expect(validateHTPasswdPassword('something\u00D5')).toMatchObject({
    emptyPassword: false,
    baseRequirements: true,
    uppercase: true,
    lowercase: false,
    numbersOrSymbols: false,
  });
  expect(validateHTPasswdPassword('something something')).toMatchObject({
    emptyPassword: false,
    baseRequirements: true,
    uppercase: true,
    lowercase: false,
    numbersOrSymbols: true,
  });
});

test('HTPasswd username', () => {
  expect(validateHTPasswdUsername('username1234')).toBeUndefined();
  expect(validateHTPasswdUsername('username%')).toBe('Username contains disallowed characters.');
  expect(validateHTPasswdUsername('username:')).toBe('Username contains disallowed characters.');
  expect(validateHTPasswdUsername('username/')).toBe('Username contains disallowed characters.');
});
