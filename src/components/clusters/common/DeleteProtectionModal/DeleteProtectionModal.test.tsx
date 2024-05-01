import React from 'react';
import * as reactRedux from 'react-redux';

import { closeModal } from '~/components/common/Modal/ModalActions';
import { useGlobalState } from '~/redux/hooks';
import { checkAccessibility, render, screen } from '~/testUtils';

import DeleteProtectionModal from './DeleteProtectionModal';

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));

jest.mock('~/components/common/Modal/ModalActions', () => ({
  closeModal: jest.fn(),
}));

jest.mock('react-redux', () => {
  const config = {
    __esModule: true,
    ...jest.requireActual('react-redux'),
  };
  return config;
});

const useGlobalStateMock = useGlobalState as jest.Mock;
const closeModalMock = closeModal as jest.Mock;

describe('<DeleteProtectionModal />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();
  useDispatchMock.mockReturnValue(mockedDispatch);

  it('is accessible', async () => {
    useGlobalStateMock.mockReturnValueOnce({ clusterID: 'fake', protectionEnabled: false });
    useGlobalStateMock.mockReturnValueOnce({
      updateDeleteProtection: { error: false, fulfilled: false, pending: false },
    });

    const { container } = render(<DeleteProtectionModal onClose={jest.fn()} />);
    await checkAccessibility(container);
  });

  it('disaplys an error message when enabling has failed', () => {
    useGlobalStateMock.mockReturnValueOnce({ clusterID: 'fake', protectionEnabled: false });
    useGlobalStateMock.mockReturnValueOnce({
      updateDeleteProtection: { error: true, fulfilled: false, pending: false },
    });

    render(<DeleteProtectionModal onClose={jest.fn()} />);

    expect(screen.getByText('Error enabling Delete Protection')).toBeInTheDocument();
  });

  it('disaplys an error message when disabling has failed', () => {
    useGlobalStateMock.mockReturnValueOnce({ clusterID: 'fake', protectionEnabled: true });
    useGlobalStateMock.mockReturnValueOnce({
      updateDeleteProtection: { error: true, fulfilled: false, pending: false },
    });

    render(<DeleteProtectionModal onClose={jest.fn()} />);

    expect(screen.getByText('Error disabling Delete Protection')).toBeInTheDocument();
  });

  it('closes the modal', async () => {
    useGlobalStateMock.mockReturnValueOnce({ clusterID: 'fake', protectionEnabled: false });
    useGlobalStateMock.mockReturnValueOnce({
      updateDeleteProtection: { error: false, fulfilled: false, pending: false },
    });

    const { user } = render(<DeleteProtectionModal onClose={jest.fn()} />);
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(closeModalMock).toHaveBeenCalled();
  });
});
