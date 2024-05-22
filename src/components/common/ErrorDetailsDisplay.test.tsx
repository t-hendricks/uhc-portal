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
});
