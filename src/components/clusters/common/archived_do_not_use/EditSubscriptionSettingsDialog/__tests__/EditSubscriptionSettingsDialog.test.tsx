import React from 'react';
import * as reactRedux from 'react-redux';

import { closeModal } from '~/components/common/Modal/ModalActions';
import {
  clearEditSubscriptionSettingsResponse,
  editSubscriptionSettings,
} from '~/redux/actions/subscriptionSettingsActions';
import { useGlobalState } from '~/redux/hooks';
import { checkAccessibility, render, screen } from '~/testUtils';

import { defaultSubscription } from '../../../__tests__/defaultClusterFromSubscription.fixtures';
import EditSubscriptionSettingsDialog from '../EditSubscriptionSettingsDialog';

jest.mock('../EditSubscriptionSettingsFields', () => (props: any) => (
  <div data-testid="edit-subscription-settings-fields-mock" />
));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));

jest.mock('~/components/common/Modal/ModalActions', () => ({
  closeModal: jest.fn(),
}));

jest.mock('~/redux/actions/subscriptionSettingsActions', () => ({
  clearEditSubscriptionSettingsResponse: jest.fn(),
  editSubscriptionSettings: jest.fn(),
}));

const useGlobalStateMock = useGlobalState as jest.Mock;
const closeModalMock = closeModal as jest.Mock;
const clearEditSubscriptionSettingsResponseMock =
  clearEditSubscriptionSettingsResponse as jest.Mock;
const editSubscriptionSettingsMock = editSubscriptionSettings as jest.Mock;

describe('<EditSubscriptionSettingsDialog />', () => {
  const onCloseMock = jest.fn();
  beforeEach(jest.clearAllMocks);

  it('is accessible', async () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce(defaultSubscription);
    useGlobalStateMock.mockReturnValueOnce(false);
    useGlobalStateMock.mockReturnValueOnce('whatever the cluster name');
    useGlobalStateMock.mockReturnValueOnce({});

    // Act
    const { container } = render(<EditSubscriptionSettingsDialog onClose={onCloseMock} />);

    // Assert
    await checkAccessibility(container);
  });

  it('does not display the cluster name', () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce(defaultSubscription);
    useGlobalStateMock.mockReturnValueOnce(false);
    useGlobalStateMock.mockReturnValueOnce('whatever the cluster name');
    useGlobalStateMock.mockReturnValueOnce({});

    // Act
    render(<EditSubscriptionSettingsDialog onClose={onCloseMock} />);

    // Assert
    expect(
      screen.getByRole('heading', {
        name: /subscription settings/i,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/whatever the cluster name/i)).not.toBeInTheDocument();
  });

  it('does display the cluster name', () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce(defaultSubscription);
    useGlobalStateMock.mockReturnValueOnce(true);
    useGlobalStateMock.mockReturnValueOnce('whatever the cluster name');
    useGlobalStateMock.mockReturnValueOnce({});

    // Act
    render(<EditSubscriptionSettingsDialog onClose={onCloseMock} />);

    // Assert
    expect(screen.getByText(/whatever the cluster name/i)).toBeInTheDocument();
  });

  describe('user interacting with the modal', () => {
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    const dispatchMock = jest.fn();

    beforeEach(() => {
      jest.resetAllMocks();
      useDispatchMock.mockReturnValue(dispatchMock);
      closeModalMock.mockReturnValue('closeModalValue');
      clearEditSubscriptionSettingsResponseMock.mockReturnValue(
        'clearEditSubscriptionSettingsResponseValue',
      );
      editSubscriptionSettingsMock.mockReturnValue('editSubscriptionSettingsValue');
    });

    it.each([['cancel'], ['close']])('clicks on %s button', async (buttonName: string) => {
      // Arrange
      useGlobalStateMock.mockReturnValueOnce(defaultSubscription);
      useGlobalStateMock.mockReturnValueOnce(true);
      useGlobalStateMock.mockReturnValueOnce('whatever the cluster name');
      useGlobalStateMock.mockReturnValueOnce({});
      const { user } = render(<EditSubscriptionSettingsDialog onClose={onCloseMock} />);

      // Act
      await user.click(
        screen.getByRole('button', {
          name: new RegExp(buttonName, 'i'),
        }),
      );

      // Assert
      expect(onCloseMock).toHaveBeenCalledTimes(0);
      expect(closeModalMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenCalledWith('closeModalValue');
      expect(dispatchMock).toHaveBeenCalledWith('clearEditSubscriptionSettingsResponseValue');
    });

    it('clicks on Save button', async () => {
      // Arrange
      useGlobalStateMock.mockReturnValueOnce({ ...defaultSubscription, id: 'whatevertheid' });
      useGlobalStateMock.mockReturnValueOnce(true);
      useGlobalStateMock.mockReturnValueOnce('whatever the cluster name');
      useGlobalStateMock.mockReturnValueOnce({});
      const { user } = render(<EditSubscriptionSettingsDialog onClose={onCloseMock} />);

      // Act
      await user.click(
        screen.getByRole('button', {
          name: /save/i,
        }),
      );

      // Assert
      expect(onCloseMock).toHaveBeenCalledTimes(0);
      expect(closeModalMock).toHaveBeenCalledTimes(0);
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith('editSubscriptionSettingsValue');
      expect(editSubscriptionSettingsMock).toHaveBeenCalledWith('whatevertheid', {
        id: 'whatevertheid',
        isValid: true,
        managed: false,
      });
    });

    it('clicks on Save button. Sockets', async () => {
      // Arrange
      useGlobalStateMock.mockReturnValueOnce({
        ...defaultSubscription,
        id: 'whatevertheid',
        socket_total: 20,
        cpu_total: 10,
        system_units: 'Sockets',
      });
      useGlobalStateMock.mockReturnValueOnce(true);
      useGlobalStateMock.mockReturnValueOnce('whatever the cluster name');
      useGlobalStateMock.mockReturnValueOnce({});
      const { user } = render(<EditSubscriptionSettingsDialog onClose={onCloseMock} />);

      // Act
      await user.click(
        screen.getByRole('button', {
          name: /save/i,
        }),
      );

      // Assert
      expect(onCloseMock).toHaveBeenCalledTimes(0);
      expect(closeModalMock).toHaveBeenCalledTimes(0);
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith('editSubscriptionSettingsValue');
      expect(editSubscriptionSettingsMock).toHaveBeenCalledWith('whatevertheid', {
        cpu_total: 20,
        id: 'whatevertheid',
        isValid: true,
        managed: false,
        socket_total: 20,
        system_units: 'Sockets',
      });
    });

    it('clicks on Save button. Cores/vCPU', async () => {
      // Arrange
      useGlobalStateMock.mockReturnValueOnce({
        ...defaultSubscription,
        id: 'whatevertheid',
        socket_total: 30,
        cpu_total: 40,
        system_units: 'Cores/vCPU',
      });
      useGlobalStateMock.mockReturnValueOnce(true);
      useGlobalStateMock.mockReturnValueOnce('whatever the cluster name');
      useGlobalStateMock.mockReturnValueOnce({});
      const { user } = render(<EditSubscriptionSettingsDialog onClose={onCloseMock} />);

      // Act
      await user.click(
        screen.getByRole('button', {
          name: /save/i,
        }),
      );

      // Assert
      expect(onCloseMock).toHaveBeenCalledTimes(0);
      expect(closeModalMock).toHaveBeenCalledTimes(0);
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith('editSubscriptionSettingsValue');
      expect(editSubscriptionSettingsMock).toHaveBeenCalledWith('whatevertheid', {
        cpu_total: 40,
        id: 'whatevertheid',
        isValid: true,
        managed: false,
        socket_total: 1,
        system_units: 'Cores/vCPU',
      });
    });
  });
});
