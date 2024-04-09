import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';
import { ErrorState } from '~/types/types';

import ErrorModal from './ErrorModal';

describe('<ErrorModal />', () => {
  const errorResponse: ErrorState = {
    pending: false,
    error: true,
    fulfilled: false,
    errorMessage: 'Error Message',
    operationID: '1337',
  };
  const resetResponse = jest.fn();
  const closeModal = jest.fn();

  const defaultProps = {
    title: 'Error Modal',
    errorResponse,
    resetResponse,
    closeModal,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('is accessible', async () => {
    const { container } = render(<ErrorModal {...defaultProps} />);

    await checkAccessibility(container);

    expect(screen.getByText('Error Message')).toBeInTheDocument();
    expect(screen.getByText('Operation ID: 1337')).toBeInTheDocument();
  });
});
