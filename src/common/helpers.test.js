import helpers from './helpers';

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
