import React from 'react';
import * as reactRedux from 'react-redux';

import { closeModal } from '~/components/common/Modal/ModalActions';
import { checkAccessibility, screen, withState } from '~/testUtils';

import DeleteProtectionModal from './DeleteProtectionModal';

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

describe('<DeleteProtectionModal />', () => {
  it('is accessible', async () => {
    const defaultState = {
      modal: {
        data: { clusterID: 'fale-id', protectionEnabled: false },
      },
      deleteProtection: {
        updateDeleteProtection: { error: false, fulfilled: false, pending: false },
      },
    };
    const { container } = withState(defaultState).render(
      <DeleteProtectionModal onClose={jest.fn()} />,
    );
    await checkAccessibility(container);
  });

  it('disaplys an error message when enabling has failed', () => {
    const stateWithEror = {
      modal: {
        data: { clusterID: 'fale-id', protectionEnabled: false },
      },
      deleteProtection: {
        updateDeleteProtection: { error: true, fulfilled: false, pending: false },
      },
    };
    withState(stateWithEror).render(<DeleteProtectionModal onClose={jest.fn()} />);
    expect(screen.getByText('Error enabling Delete Protection')).toBeInTheDocument();
  });

  it('disaplys an error message when disabling has failed', () => {
    const stateWithEror = {
      modal: {
        data: { clusterID: 'fale-id', protectionEnabled: true },
      },
      deleteProtection: {
        updateDeleteProtection: { error: true, fulfilled: false, pending: false },
      },
    };
    withState(stateWithEror).render(<DeleteProtectionModal onClose={jest.fn()} />);
    expect(screen.getByText('Error disabling Delete Protection')).toBeInTheDocument();
  });

  describe('Close modal action', () => {
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    const mockedDispatch = jest.fn();
    useDispatchMock.mockReturnValue(mockedDispatch);

    afterEach(() => {
      useDispatchMock.mockClear();
      mockedDispatch.mockClear();
    });

    it('closes the modal', async () => {
      const closeModalMock = closeModal as jest.Mock;
      const defaultState = {
        modal: {
          data: { clusterID: 'fake-id', protectionEnabled: false },
        },
        deleteProtection: {
          updateDeleteProtection: { error: false, fulfilled: false, pending: false },
        },
      };
      const { user } = withState(defaultState).render(
        <DeleteProtectionModal onClose={jest.fn()} />,
      );
      await user.click(screen.getByRole('button', { name: /cancel/i }));
      expect(closeModalMock).toHaveBeenCalled();
    });
  });
});
