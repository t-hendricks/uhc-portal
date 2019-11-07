import validators, {
  required, checkIdentityProviderName, checkClusterUUID,
  checkClusterConsoleURL, checkUserID, checkOpenIDIssuer,
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

test('User ID does not contain slash', () => {
  expect(checkUserID('aaaaa/bbbbb')).toBe('User ID cannot contain \'/\'.');
  expect(checkUserID('aaaa')).toBe(undefined);
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
  expect(checkClusterConsoleURL('www.example.hey/hey')).toBe('Invalid URL. Provide a valid URL address without a query string (?) or fragment (#)');
  expect(checkClusterConsoleURL('ftp://hello.com')).toBe('Invalid URL. Provide a valid URL address without a query string (?) or fragment (#)');
  expect(checkClusterConsoleURL('http://example.com\noa')).toBe('Invalid URL. Provide a valid URL address without a query string (?) or fragment (#)');
  expect(checkClusterConsoleURL('http://www.example:55815.com')).toBe('Invalid URL. Provide a valid URL address without a query string (?) or fragment (#)');
  expect(checkClusterConsoleURL('https://www-whatever.apps.example.co.uk/')).toBe(undefined);
  expect(checkClusterConsoleURL('http://www.example.com:foo')).toBe('Invalid URL. Provide a valid URL address without a query string (?) or fragment (#)');
  expect(checkClusterConsoleURL('http://www.example.com....')).toBe('Invalid URL. Provide a valid URL address without a query string (?) or fragment (#)');
  expect(checkClusterConsoleURL('http://blog.example.com')).toBe(undefined);
  expect(checkClusterConsoleURL('http://255.255.255.255')).toBe(undefined);
  expect(checkClusterConsoleURL('http://www.site.com:8008')).toBe(undefined);
  expect(checkClusterConsoleURL('http://www.example.com/product')).toBe(undefined);
  expect(checkClusterConsoleURL('example.com/')).toBe('Invalid URL. Provide a valid URL address without a query string (?) or fragment (#)');
  expect(checkClusterConsoleURL('www.example.com')).toBe('Invalid URL. Provide a valid URL address without a query string (?) or fragment (#)');
  expect(checkClusterConsoleURL('http://www.example.com#up')).toBe('Invalid URL. Provide a valid URL address without a query string (?) or fragment (#)');
  expect(checkClusterConsoleURL('http://www.example.com/products?id=1&page=2')).toBe('Invalid URL. Provide a valid URL address without a query string (?) or fragment (#)');
  expect(checkClusterConsoleURL('255.255.255.255')).toBe('Invalid URL. Provide a valid URL address without a query string (?) or fragment (#)');
  expect(checkClusterConsoleURL('http://invalid.com/perl.cgi?key=')).toBe('Invalid URL. Provide a valid URL address without a query string (?) or fragment (#)');
});

test('Field is a valid issuer', () => {
  expect(checkOpenIDIssuer()).toBe('Issuer is required.');
  expect(checkOpenIDIssuer('http://www.example.com')).toBe('Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('https://example.com/')).toBe(undefined);
  expect(checkOpenIDIssuer('www.example.hey/hey')).toBe('Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('ftp://hello.com')).toBe('Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('https://example.com\noa')).toBe('Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('https://www.example:55815.com')).toBe('Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('https://www-whatever.apps.example.co.uk/')).toBe(undefined);
  expect(checkOpenIDIssuer('https://www.example.com:foo')).toBe('Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('https://www.example.com....')).toBe('Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('https://blog.example.com')).toBe(undefined);
  expect(checkOpenIDIssuer('https://255.255.255.255')).toBe(undefined);
  expect(checkOpenIDIssuer('https://www.site.com:8008')).toBe(undefined);
  expect(checkOpenIDIssuer('https://www.example.com/product')).toBe(undefined);
  expect(checkOpenIDIssuer('example.com/')).toBe('Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('www.example.com')).toBe('Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('https://www.example.com#up')).toBe('Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('https://www.example.com/products?id=1&page=2')).toBe('Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('255.255.255.255')).toBe('Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)');
  expect(checkOpenIDIssuer('https://invalid.com/perl.cgi?key=')).toBe('Invalid URL. Issuer must use https scheme without a query string (?) or fragment (#)');
});

test('Field contains a numeric string', () => {
  expect(validators.validateNumericInput()).toBe(undefined);
  expect(validators.validateNumericInput('8.8', { allowDecimal: true })).toBe(undefined);
  expect(validators.validateNumericInput('8.8')).toBe('Input must be an integer.');
  expect(validators.validateNumericInput('-10')).toBe('Input must be a positive number.');
  expect(validators.validateNumericInput('-10', { allowNeg: true })).toBe(undefined);
  expect(validators.validateNumericInput('asdf')).toBe('Input must be a number.');
  expect(validators.validateNumericInput('0', { allowZero: true })).toBe(undefined);
  expect(validators.validateNumericInput('1000', { max: 999 })).toBe('Input cannot be more than 999.');
  expect(validators.validateNumericInput('999', { max: 999 })).toBe(undefined);
  expect(validators.validateNumericInput(Number.MAX_SAFE_INTEGER)).toBe(undefined);
});
