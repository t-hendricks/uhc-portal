import validators, {
  required, checkIdentityProviderName, checkClusterUUID, checkClusterConsoleURL,
} from './validators';

test('Field is required', () => {
  expect(required()).toBe('Field is required');
  expect(required('foo')).toBe(undefined);
});

test('Field is a valid identity provider name', () => {
  expect(checkIdentityProviderName()).toBe('Name is required.');
  expect(checkIdentityProviderName('foo bar')).toBe('Name must not contain whitespaces.');
  expect(checkIdentityProviderName(' ')).toBe('Name must not contain whitespaces.');
  expect(checkIdentityProviderName('foobar ')).toBe('Name must not contain whitespaces.');
  expect(checkIdentityProviderName('foo')).toBe(undefined);
});

test('Field is a valid cluster name', () => {
  expect(validators.checkClusterName()).toBe('Cluster name is required.');
  expect(validators.checkClusterName('foo.bar')).toBe('Cluster name \'foo.bar\' isn\'t valid, must consist of lower-case alphanumeric characters or \'-\', start with an alphabetic character, and end with an alphanumeric character. For example, \'my-name\', or \'abc-123\'.');
  expect(validators.checkClusterName('foo'.repeat(34))).toBe('Cluster names may not exceed 50 characters.');
  expect(validators.checkClusterName('foo')).toBe(undefined);
});

test('Field is a valid UUID', () => {
  expect(checkClusterUUID()).toBe('Cluster ID is required.');
  expect(checkClusterUUID('foo.bar')).toBe('Cluster ID \'foo.bar\' is not a valid UUID.');
  expect(checkClusterUUID('1e479c87-9b83-41c5-854d-e5fec41ce7f8')).toBe(undefined);
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

test('Field is valid node count', () => {
  expect(validators.nodes(3, { value: 4, validationMsg: 'At least 4 nodes are required.' })).toBe('At least 4 nodes are required.');
  expect(validators.nodes(4, { value: 4, validationMsg: 'At least 4 nodes are required.' })).toBe(undefined);
  expect(validators.nodes(5, { value: 4, validationMsg: 'At least 4 nodes are required.' })).toBe(undefined);
  expect(validators.nodes(4, { value: 9, validationMsg: 'At least 9 nodes are required for multiple availability zone cluster.' })).toBe('At least 9 nodes are required for multiple availability zone cluster.');
  expect(validators.nodes(9, { value: 9, validationMsg: 'At least 9 nodes are required for multiple availability zone cluster.' })).toBe(undefined);
  expect(validators.nodes(-1, { value: 4, validationMsg: 'At least 4 nodes are required.' })).toBe('At least 4 nodes are required.');
  expect(validators.nodes('aaa', { value: 4, validationMsg: 'At least 4 nodes are required.' })).toBe('\'aaa\' is not a valid number of nodes.');
});

test('Field is valid node count for multi AZ', () => {
  expect(validators.nodesMultiAz(3)).toBe(undefined);
  expect(validators.nodesMultiAz(4)).toBe('Number of nodes must be multiple of 3 for Multi AZ cluster.');
  expect(validators.nodesMultiAz(5)).toBe('Number of nodes must be multiple of 3 for Multi AZ cluster.');
  expect(validators.nodesMultiAz(6)).toBe(undefined);
});

test('Field is a valid console URL', () => {
  expect(checkClusterConsoleURL()).toBe('Cluster console URL should not be empty');
  expect(checkClusterConsoleURL('http://www.example.com')).toBe(undefined);
  expect(checkClusterConsoleURL('www.example.hey/hey')).toBe('Invalid URL. URL should include the hostname only, with no path');
  expect(checkClusterConsoleURL('ftp://hello.com')).toBe('Invalid URL. URL should include the hostname only, with no path');
  expect(checkClusterConsoleURL('http://example.com\noa')).toBe('Invalid URL. URL should include the hostname only, with no path');
});
