import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';
import { ErrorState } from '~/types/types';

import ErrorDetailsDisplay from './ErrorDetailsDisplay';

const baseResponse: ErrorState = {
  fulfilled: false,
  pending: false,
  error: true,
  errorMessage: 'this is some error message',
};

const defaultProps = {
  message: 'some error description',
  response: { ...baseResponse },
};

describe('<ErrorDetailsDisplay />', () => {
  it('is accessible', async () => {
    const { container } = render(<ErrorDetailsDisplay {...defaultProps} />);
    await checkAccessibility(container);
  });

  it('displays "N/A" without an operation ID', () => {
    render(<ErrorDetailsDisplay {...defaultProps} />);
    expect(screen.getByText('Operation ID: N/A')).toBeInTheDocument();
  });

  it('displays Operation ID', () => {
    const newProps = {
      ...defaultProps,
      response: { ...baseResponse, operationID: 'hello' },
    };

    render(<ErrorDetailsDisplay {...newProps} />);
    expect(screen.getByText('Operation ID: hello')).toBeInTheDocument();
  });

  describe('error code', () => {
    const newProps = {
      ...defaultProps,
      response: { ...baseResponse, errorCode: 400 },
    };

    it('is not displayed by default', () => {
      render(<ErrorDetailsDisplay {...newProps} />);
      expect(screen.queryByText('Error code: 400')).not.toBeInTheDocument();
    });

    it('is displayed when showErrorCode is on', () => {
      render(<ErrorDetailsDisplay {...newProps} showErrorCode />);
      expect(screen.getByText('Error code: 400')).toBeInTheDocument();
    });
  });

  describe('links embedded in error strings', () => {
    const errorMessage = "that's a bummer :/  visit http://example.com to learn more.";
    const errorMessageProps = {
      ...defaultProps,
      response: { ...baseResponse, errorMessage },
    };
    const errorDetailsProps = {
      ...defaultProps,
      response: {
        ...baseResponse,
        errorDetails: [{ kind: 'wat', items: ['foo', errorMessage] }],
      },
    };
    const arbitraryErrorDetailsProps = {
      ...defaultProps,
      response: {
        ...baseResponse,
        errorDetails: [
          {
            kind: 'wat',
            items: [
              {
                foo: ['bar', 'foo http://example.com bar'],
                wat: false,
              },
            ],
          },
        ],
      },
    };

    it('are rendered accessibly', () => {
      render(<ErrorDetailsDisplay {...errorMessageProps} renderLinks />);
      expect(screen.getByText(/that's a bummer.*/)).toBeInTheDocument();
      expect(screen.getByText('http://example.com')).toHaveRole('link');
    });

    describe('are rendered when renderLinks is switched ON', () => {
      it('within errorMessage', () => {
        render(<ErrorDetailsDisplay {...errorMessageProps} renderLinks />);
        expect(screen.getByText(/that's a bummer.*/)).toBeInTheDocument();
        expect(screen.getByText('http://example.com')).toHaveAttribute('href');
      });

      it('within errorDetails', () => {
        render(<ErrorDetailsDisplay {...errorDetailsProps} renderLinks />);
        expect(screen.getByText(/that's a bummer.*/)).toBeInTheDocument();
        expect(screen.getByText('http://example.com')).toHaveAttribute('href');
      });

      it('within arbitrary errorDetails items', () => {
        render(<ErrorDetailsDisplay {...arbitraryErrorDetailsProps} renderLinks />);
        expect(screen.getByText(/.*"wat": false.*/)).toBeInTheDocument();
        expect(screen.getByText('http://example.com')).toHaveAttribute('href');
      });
    });

    describe('are NOT rendered when renderLinks is switched OFF', () => {
      it('within errorMessage', () => {
        render(<ErrorDetailsDisplay {...errorMessageProps} />);
        expect(screen.getByText(/that's a bummer.*/)).toBeInTheDocument();
        expect(screen.queryByText(/http:\/\/example\.com/)).not.toHaveAttribute('href');
      });

      it('within errorDetails', () => {
        render(<ErrorDetailsDisplay {...errorDetailsProps} />);
        expect(screen.getByText(/that's a bummer.*/)).toBeInTheDocument();
        expect(screen.queryByText(/http:\/\/example\.com/)).not.toHaveAttribute('href');
      });

      it('within arbitrary errorDetails items', () => {
        render(<ErrorDetailsDisplay {...arbitraryErrorDetailsProps} />);
        expect(screen.getByText(/.*"wat": false.*/)).toBeInTheDocument();
        expect(screen.queryByText(/http:\/\/example\.com/)).not.toHaveAttribute('href');
      });
    });
  });

  it('properly renders ExcessResources kind items with addon resource_type', () => {
    const newProps = {
      ...defaultProps,
      response: {
        ...baseResponse,
        errorDetails: [
          {
            kind: 'ExcessResources',
            items: [
              {
                resource_type: 'addon',
                resource_name: 'addon-prow-operator',
                availability_zone_type: 'single',
                count: 5,
                billing_model: 'standard',
              },
            ],
          },
        ],
      },
    };

    render(<ErrorDetailsDisplay {...newProps} />);
    expect(screen.getByRole('listitem')).toHaveTextContent('addon: addon-prow-operator');
  });

  it('properly renders AddOnParameterOptionList kind', () => {
    const newProps = {
      ...defaultProps,
      response: {
        ...baseResponse,
        errorDetails: [
          {
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
          },
        ],
      },
    };

    const { container } = render(<ErrorDetailsDisplay {...newProps} />);

    const expected =
      '[ { "name": "Option 1", "value": "option 1" }, { "name": "Option 2", "value": "option 2" } ]';
    expect(container.querySelector('pre')).toHaveTextContent(expected);
  });

  it('properly renders AddOnRequirementData kind', () => {
    const newProps = {
      ...defaultProps,
      response: {
        ...baseResponse,
        errorDetails: [
          {
            kind: 'AddOnRequirementData',
            items: {
              'cloud_provider.id': 'gcp',
              'region.id': ['us-east-1', 'eu-west-1'],
            },
          },
        ],
      },
    };

    const { container } = render(<ErrorDetailsDisplay {...newProps} />);

    const expected = '{ "cloud_provider.id": "gcp", "region.id": [ "us-east-1", "eu-west-1" ] }';
    expect(container.querySelector('pre')).toHaveTextContent(expected);
  });
});
