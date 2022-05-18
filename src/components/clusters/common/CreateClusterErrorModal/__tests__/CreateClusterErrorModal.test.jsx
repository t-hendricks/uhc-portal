import React from 'react';
import * as ReactRedux from 'react-redux';

import { render, screen } from '@testUtils';
import CreateClusterErrorModal from '../CreateClusterErrorModal';

describe('CreateClusterErrorModal', () => {
  const useSelectorSpy = jest.spyOn(ReactRedux, 'useSelector');

  it('shows default error modal with non-discoverable errorDetails', () => {
    useSelectorSpy.mockReturnValueOnce({
      error: true,
      errorDetails: null,
      errorMessage: '',
      fulfilled: false,
      pending: false,
    });
    render(<CreateClusterErrorModal />);

    expect(screen.getByRole('heading', { name: 'Error creating cluster' })).toBeVisible();
  });

  it('shows missing prereq error modal when errorDetails contains the corresponding key', () => {
    useSelectorSpy.mockReturnValueOnce({
      error: true,
      errorDetails: [{ Error_Key: 'AWSCredsNotOSDCCSAdmin' }],
      errorMessage: '',
      fulfilled: false,
      pending: false,
    });
    render(<CreateClusterErrorModal />);

    expect(screen.getByRole('heading', { name: 'Missing prerequisite' })).toBeVisible();
  });
});
