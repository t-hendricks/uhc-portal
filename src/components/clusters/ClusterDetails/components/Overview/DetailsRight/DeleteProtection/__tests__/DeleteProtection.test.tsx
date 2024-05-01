import React from 'react';
import * as reactRedux from 'react-redux';

import { openModal } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';
import { render, screen } from '~/testUtils';

import DeleteProtection from '../DeleteProtection';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('~/components/common/Modal/ModalActions');

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));

describe('<DeleteProtection />', () => {
  it('Shows cluster delete protection is enabled', () => {
    const props = {
      protectionEnabled: true,
      clusterID: 'fake-cluster',
    };
    render(<DeleteProtection {...props} />);
    expect(screen.getByText('Delete Protection: Enabled')).toBeInTheDocument();
  });

  it('Shows cluster delete protection is disabled', () => {
    const props = {
      protectionEnabled: false,
      clusterID: 'fake-cluster',
    };
    render(<DeleteProtection {...props} />);
    expect(screen.getByText('Delete Protection: Disabled')).toBeInTheDocument();
  });

  it('Opens the modal', async () => {
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    const mockedDispatch = jest.fn();
    useDispatchMock.mockReturnValue(mockedDispatch);
    const props = {
      protectionEnabled: false,
      clusterID: 'fake-cluster',
    };
    const { user } = render(<DeleteProtection {...props} />);
    await user.click(screen.getByRole('button'));
    expect(openModal).toHaveBeenCalledWith(modals.DELETE_PROTECTION, { ...props });
  });
});
