import React from 'react';
import * as reactRedux from 'react-redux';

import getClusterName from '~/common/getClusterName';
import {
  clearToggleSubscriptionReleasedResponse,
  toggleSubscriptionReleased,
} from '~/redux/actions/subscriptionReleasedActions';
import { useGlobalState } from '~/redux/hooks';
import { checkAccessibility, render, screen } from '~/testUtils';
import { SubscriptionCommonFieldsStatus } from '~/types/accounts_mgmt.v1';

import TransferClusterOwnershipDialog from '../TransferClusterOwnershipDialog';

import { requestState, subscription } from './TransferClusterOwnershipDialog.fixtures';

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));

jest.mock('react-redux', () => {
  const config = {
    __esModule: true,
    ...jest.requireActual('react-redux'),
  };
  return config;
});

jest.mock('~/redux/actions/subscriptionReleasedActions', () => ({
  clearToggleSubscriptionReleasedResponse: jest.fn(),
  toggleSubscriptionReleased: jest.fn(),
}));

jest.mock('~/common/getClusterName', () => jest.fn());

const useGlobalStateMock = useGlobalState as jest.Mock;
const clearToggleSubscriptionReleasedResponseMock =
  clearToggleSubscriptionReleasedResponse as jest.Mock;
const toggleSubscriptionReleasedMock = toggleSubscriptionReleased as jest.Mock;
const getClusterNameMock = getClusterName as jest.Mock;

describe('<TransferClusterOwnershipDialog />', () => {
  const onClose = jest.fn();
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatchMock.mockReturnValue(mockedDispatch);
    clearToggleSubscriptionReleasedResponseMock.mockReturnValue(
      'clearToggleSubscriptionReleasedResponseResponse',
    );
    toggleSubscriptionReleasedMock.mockReturnValue('toggleSubscriptionReleasedResponse');
  });

  it('is accessible', async () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce({ subscription });
    useGlobalStateMock.mockReturnValueOnce(requestState);
    const { container } = render(<TransferClusterOwnershipDialog onClose={onClose} />);

    // Act
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Assert
    await checkAccessibility(container);
  });

  it('should release clusters', async () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce({ subscription: { ...subscription, released: false } });
    useGlobalStateMock.mockReturnValueOnce(requestState);
    const { user } = render(<TransferClusterOwnershipDialog onClose={onClose} />);
    expect(toggleSubscriptionReleasedMock).toHaveBeenCalledTimes(0);

    // Act
    await user.click(screen.getByRole('button', { name: 'Initiate transfer' }));

    // Assert
    expect(toggleSubscriptionReleasedMock).toHaveBeenCalledWith('0', true);
    expect(mockedDispatch).toHaveBeenCalledWith('toggleSubscriptionReleasedResponse');
  });

  it('should not show dialog for canceling transfer', () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce({ subscription: { ...subscription, released: true } });
    useGlobalStateMock.mockReturnValueOnce(requestState);

    // Act
    const { container } = render(<TransferClusterOwnershipDialog onClose={onClose} />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it('should show dialog for transferring disconnected clusters', () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce({
      subscription: {
        ...subscription,
        released: false,
        status: SubscriptionCommonFieldsStatus.Disconnected,
      },
    });
    useGlobalStateMock.mockReturnValueOnce(requestState);

    // Act
    render(<TransferClusterOwnershipDialog onClose={onClose} />);

    // Assert
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should show error', () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce({
      subscription: {
        ...subscription,
        released: false,
        status: SubscriptionCommonFieldsStatus.Disconnected,
      },
    });
    useGlobalStateMock.mockReturnValueOnce({ error: true, errorMessage: 'this is an error' });

    // Act
    render(<TransferClusterOwnershipDialog onClose={onClose} />);

    // Assert
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('alert-error')).toBeInTheDocument();
  });

  it('should display modal when subscription is undefined', () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce({
      subscription: undefined,
    });
    useGlobalStateMock.mockReturnValueOnce(requestState);

    // Act
    render(<TransferClusterOwnershipDialog onClose={onClose} />);

    // Assert
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('is onClose called', () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce({
      subscription: undefined,
    });
    useGlobalStateMock.mockReturnValueOnce({ ...requestState, fulfilled: true });

    // Act
    render(<TransferClusterOwnershipDialog onClose={onClose} />);

    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(clearToggleSubscriptionReleasedResponseMock).toHaveBeenCalledWith();
    expect(mockedDispatch).toHaveBeenCalledWith('clearToggleSubscriptionReleasedResponseResponse');
  });

  it('shouldDisplayClusterName false', () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce({
      subscription: undefined,
      shouldDisplayClusterName: false,
    });
    useGlobalStateMock.mockReturnValueOnce({ ...requestState, fulfilled: true });
    getClusterNameMock.mockReturnValue('whatever the name');

    // Act
    render(<TransferClusterOwnershipDialog onClose={onClose} />);

    // Assert
    expect(screen.queryByText(/whatever the name/i)).not.toBeInTheDocument();
  });

  it('shouldDisplayClusterName true', () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce({
      subscription: undefined,
      shouldDisplayClusterName: true,
    });
    useGlobalStateMock.mockReturnValueOnce({ ...requestState, fulfilled: true });
    getClusterNameMock.mockReturnValue('whatever the name');

    // Act
    render(<TransferClusterOwnershipDialog onClose={onClose} />);

    // Assert
    expect(screen.getByText(/whatever the name/i)).toBeInTheDocument();
  });
});
