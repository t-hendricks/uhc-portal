import { formatErrorDetails, getErrorMessage } from '../errors';

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

describe('formatErrorDetails()', () => {
  it('handles AddOnParameterOptionList kind', () => {
    const errDetails = [{
      kind: 'AddOnParameterOptionList',
      items: [
        {
          name: 'Option 1',
          value: 'option 1',
        },
        {
          name: 'Option 2',
          value: 'option 2',
        },
      ],
    }];
    expect(formatErrorDetails(errDetails)).toMatchSnapshot();
  });

  it('handles AddOnRequirementData kind', () => {
    const errDetails = [{
      kind: 'AddOnRequirementData',
      items: {
        'cloud_provider.id': 'gcp',
        'region.id': [
          'us-east-1',
          'eu-west-1',
        ],
      },
    }];
    expect(formatErrorDetails(errDetails)).toMatchSnapshot();
  });
});
