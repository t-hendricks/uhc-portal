import validators from './validators';

test('Field is required', () => {
  expect(validators.required()).toBe('Field is required');
  expect(validators.required('foo')).toBe(undefined);
});

test('Field is a valid identity provider name', () => {
  expect(validators.checkIdentityProviderName()).toBe('Name is required.');
  expect(validators.checkIdentityProviderName('foo bar')).toBe('Name must not contain whitespaces.');
  expect(validators.checkIdentityProviderName(' ')).toBe('Name must not contain whitespaces.');
  expect(validators.checkIdentityProviderName('foobar ')).toBe('Name must not contain whitespaces.');
  expect(validators.checkIdentityProviderName('foo')).toBe(undefined);
});

test('Field is a valid cluster name', () => {
  expect(validators.checkClusterName()).toBe('Cluster name is required.');
  expect(validators.checkClusterName('foo.bar')).toBe('Cluster name \'foo.bar\' isn\'t valid, must consist of lower-case alphanumeric characters or \'-\', start with an alphabetic character, and end with an alphanumeric character. For example, \'my-name\', or \'abc-123\'.');
  expect(validators.checkClusterName('foo')).toBe(undefined);
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

test('Field is a valid router shard label', () => {
  expect(validators.routerShard('foo.bar')).toBe('Router shard label \'foo.bar\' isn\'t valid, must consist of lower-case alphanumeric characters or \'-\', start with an alphabetic character, and end with an alphanumeric character. For example, \'my-label\', or \'abc-123\'.');
  expect(validators.routerShard('qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm')).toBe('Router shard label \'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm\' is too long, it needs to be under 63 charcters long.');
  expect(validators.routerShard('foo')).toBe(undefined);
});
