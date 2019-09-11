import helpers, { buildUrlParams } from './helpers';

test('Error message is properly extracted from the Error API object', () => {
  const err = {
    response: {
      data: {
        kind: 'Error',
        id: 1,
        href: 'http://example.com',
        code: 'CLUSTERS-MGMT-1',
        reason: 'human readable reason',
      },
    },
  };
  expect(helpers.getErrorMessage(err)).toBe('CLUSTERS-MGMT-1:\nhuman readable reason');
});

test('Error message is properly extracted from unexpected object', () => {
  const err = {
    response: {
      data: {
        unexpected: 'object',
      },
    },
  };
  expect(helpers.getErrorMessage(err)).toBe('{"unexpected":"object"}');
});

test('Fail gracefully when getting JS Error objects', () => {
  const err = new Error('Hello');
  expect(helpers.getErrorMessage(err)).toBe('Error: Hello');
});

test('Test buildUrlParams', () => {
  const params = { key1: 'a ', key2: 'a?' };
  expect(buildUrlParams(params)).toBe('key1=a%20&key2=a%3F');
});
