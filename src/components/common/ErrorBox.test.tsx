import React from 'react';

import { screen, render, checkAccessibility } from '~/testUtils';
import { ErrorState } from '~/types/types';
import ErrorBox from './ErrorBox';

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

describe('<ErrorBox />', () => {
  it('displays "N/A" without an operation ID', () => {
    render(<ErrorBox {...defaultProps} />);
    expect(screen.getByText('Operation ID: N/A')).toBeInTheDocument();
  });

  it('displays Operation ID', () => {
    const newProps = {
      ...defaultProps,
      response: { ...baseResponse, operationID: 'hello' },
    };

    render(<ErrorBox {...newProps} />);
    expect(screen.getByText('Operation ID: hello')).toBeInTheDocument();
  });

  it('displays with warning variant', async () => {
    const warningProps = {
      ...defaultProps,
      variant: 'warning' as 'danger' | 'warning',
    };
    const { container } = render(<ErrorBox {...warningProps} />);
    expect(screen.getByText('Warning alert:')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays a danger variant', async () => {
    const dangerProps = {
      ...defaultProps,
      variant: 'danger' as 'danger' | 'warning',
    };
    const { container } = render(<ErrorBox {...dangerProps} />);
    expect(screen.getByText('Danger alert:')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays a danger variant when no variant is sent', () => {
    const dangerProps = {
      ...defaultProps,
      variant: undefined,
    };
    render(<ErrorBox {...dangerProps} />);
    expect(screen.getByText('Danger alert:')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render expandable', () => {
    const exapandableProps = {
      ...defaultProps,
      isExpandable: true,
    };
    render(<ErrorBox {...exapandableProps} />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-controls');
  });
});
