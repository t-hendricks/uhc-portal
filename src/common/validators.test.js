import validators from './validators';

test('Field is required', () => {
  expect(validators.required()).toBe('Field is required');
  expect(validators.required('foo')).toBe(undefined);
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
