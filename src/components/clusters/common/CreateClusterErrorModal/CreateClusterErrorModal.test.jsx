import React from 'react';
import * as ReactRedux from 'react-redux';

import { render, screen, checkAccessibility } from '@testUtils';
import CreateClusterErrorModal from './CreateClusterErrorModal';

jest.mock('react-redux', () => {
  const config = {
    __esModule: true,
    ...jest.requireActual('react-redux'),
  };
  return config;
});

describe('<CreateClusterErrorModal />', () => {
  const useSelectorSpy = jest.spyOn(ReactRedux, 'useSelector');

  it('shows default error modal with missing errorDetails and is accessible ', async () => {
    // Arrange
    useSelectorSpy.mockReturnValueOnce({
      error: true,
      errorDetails: null,
      errorMessage: '',
      fulfilled: false,
      pending: false,
    });
    const { container } = render(<CreateClusterErrorModal />);

    // Assert
    expect(screen.getByRole('heading', { name: 'Error creating cluster' })).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('shows missing prereq error modal when errorDetails contains the corresponding key and is accessible', async () => {
    // Arrange
    useSelectorSpy.mockReturnValueOnce({
      error: true,
      errorDetails: [{ Error_Key: 'AWSCredsNotOSDCCSAdmin' }],
      errorMessage: '',
      fulfilled: false,
      pending: false,
    });
    const { container } = render(<CreateClusterErrorModal />);

    // Assert
    expect(screen.getByRole('heading', { name: 'Missing prerequisite' })).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
