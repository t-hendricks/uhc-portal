import { getErrorMessage } from '../errors';

describe('getErrorMessage()', () => {
  it('Properly extracts error message from the Error API object', () => {
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
    expect(getErrorMessage(err)).toBe('CLUSTERS-MGMT-1:\nhuman readable reason');
  });

  it('Properly extracts error message from unexpected object', () => {
    const err = {
      response: {
        data: {
          unexpected: 'object',
        },
      },
    };
    expect(getErrorMessage(err)).toBe('{"unexpected":"object"}');
  });

  it('Fails gracefully when getting JS Error objects', () => {
    const err = new Error('Hello');
    expect(getErrorMessage(err)).toBe('Error: Hello');
  });
});
