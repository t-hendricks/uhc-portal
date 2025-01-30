import React from 'react';
import * as reactRedux from 'react-redux';

import { closeModal } from '~/components/common/Modal/ModalActions';
import {
  addNotificationContact,
  clearAddNotificationContacts,
} from '~/redux/actions/supportActions';
import { useGlobalState } from '~/redux/hooks';
import { checkAccessibility, render, screen, userEvent } from '~/testUtils';

import AddNotificationContactDialog from '../AddNotificationContactDialog';

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));

jest.mock('~/redux/actions/supportActions', () => ({
  addNotificationContact: jest.fn(),
  clearAddNotificationContacts: jest.fn(),
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
const addNotificationContactMock = addNotificationContact as jest.Mock;
const clearAddNotificationContactsMock = clearAddNotificationContacts as jest.Mock;
const closeModalMock = closeModal as jest.Mock;

describe('<AddNotificationContactDialog />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();
  useDispatchMock.mockReturnValue(mockedDispatch);

  it('empty content', () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce(false);
    useGlobalStateMock.mockReturnValueOnce({ cluster: {} });
    useGlobalStateMock.mockReturnValueOnce({ addContactResponse: {} });

    // Act
    render(
      <div data-testid="parent-div">
        <AddNotificationContactDialog />
      </div>,
    );

    // Assert
    expect(screen.getByTestId('parent-div').children.length).toBe(0);
  });

  it('is accessible. Empty Content', async () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce(false);
    useGlobalStateMock.mockReturnValueOnce({ cluster: {} });
    useGlobalStateMock.mockReturnValueOnce({ addContactResponse: {} });

    // Act
    const { container } = render(<AddNotificationContactDialog />);

    // Assert
    await checkAccessibility(container);
  });

  it('is accessible. With Content', async () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce(true);
    useGlobalStateMock.mockReturnValueOnce({ cluster: {} });
    useGlobalStateMock.mockReturnValueOnce({ addContactResponse: {} });

    // Act
    const { container } = render(<AddNotificationContactDialog />);

    // Assert
    await checkAccessibility(container);
  });

  it('renders what it is expected', () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce(true);
    useGlobalStateMock.mockReturnValueOnce({ cluster: {} });
    useGlobalStateMock.mockReturnValueOnce({ addContactResponse: {} });

    // Act
    render(<AddNotificationContactDialog />);

    // Assert
    expect(screen.getByText(/add notification contact/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add contact/i })).toHaveAttribute('disabled');
    expect(addNotificationContactMock).toHaveBeenCalledTimes(0);
    expect(clearAddNotificationContactsMock).toHaveBeenCalledTimes(0);
  });

  it('after typing username', async () => {
    // Arrange
    const inputValue = 'whatever';
    // +1 because the initial render
    for (let i = 0; i < inputValue.length + 1; i += 1) {
      useGlobalStateMock.mockReturnValueOnce(true);
      useGlobalStateMock.mockReturnValueOnce({ cluster: {} });
      useGlobalStateMock.mockReturnValueOnce({ addContactResponse: {} });
    }

    render(<AddNotificationContactDialog />);

    // Act
    await userEvent.type(screen.getByRole('textbox', { name: /user name/i }), inputValue);

    // Assert
    // TODO: check whether the add contact is getEnabledHostCount, can be clicked and proper methods are called
    expect(screen.getByRole('button', { name: /add contact/i })).not.toHaveAttribute('disabled');
  });

  it('invalid typing', async () => {
    // Arrange
    const inputValue = '#@~#@~#@~#';
    // +1 because the initial render
    for (let i = 0; i < inputValue.length + 1; i += 1) {
      useGlobalStateMock.mockReturnValueOnce(true);
      useGlobalStateMock.mockReturnValueOnce({ cluster: {} });
      useGlobalStateMock.mockReturnValueOnce({ addContactResponse: {} });
    }

    render(<AddNotificationContactDialog />);

    // Act
    await userEvent.type(screen.getByRole('textbox', { name: /user name/i }), inputValue);

    // Assert
    expect(screen.getByRole('button', { name: /add contact/i })).toHaveAttribute('disabled');
    expect(screen.getByText(/username includes illegal symbols/i)).toBeInTheDocument();
  });

  it('clicks on Add Contact button', async () => {
    // Arrange
    const inputValue = 'whatever';

    // +2 because the click
    for (let i = 0; i < inputValue.length + 2; i += 1) {
      useGlobalStateMock.mockReturnValueOnce(true);
      useGlobalStateMock.mockReturnValueOnce({
        cluster: { subscription: { id: 'subscriptionId' } },
      });
      useGlobalStateMock.mockReturnValueOnce({ addContactResponse: {} });
    }

    const { user } = render(<AddNotificationContactDialog />);
    await userEvent.type(screen.getByRole('textbox', { name: /user name/i }), inputValue);

    // Act
    await user.click(screen.getByRole('button', { name: /add contact/i }));

    // Assert
    expect(addNotificationContactMock).toHaveBeenCalledTimes(1);
    expect(addNotificationContactMock).toHaveBeenCalledWith('subscriptionId', inputValue);
  });

  it('clicks on Cancel button', async () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce(true);
    useGlobalStateMock.mockReturnValueOnce({
      cluster: { subscription: { id: 'subscriptionId' } },
    });
    useGlobalStateMock.mockReturnValueOnce({ addContactResponse: {} });

    const { user } = render(<AddNotificationContactDialog />);

    // Act
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    // Assert
    expect(addNotificationContactMock).toHaveBeenCalledTimes(0);
    expect(clearAddNotificationContactsMock).toHaveBeenCalledTimes(1);
    expect(closeModalMock).toHaveBeenCalledTimes(1);
  });

  it('clicks on close button', async () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce(true);
    useGlobalStateMock.mockReturnValueOnce({
      cluster: { subscription: { id: 'subscriptionId' } },
    });
    useGlobalStateMock.mockReturnValueOnce({ addContactResponse: {} });

    const { user } = render(<AddNotificationContactDialog />);

    // Act
    await user.click(screen.getByRole('button', { name: /close/i }));

    // Assert
    expect(addNotificationContactMock).toHaveBeenCalledTimes(0);
    expect(clearAddNotificationContactsMock).toHaveBeenCalledTimes(1);
    expect(closeModalMock).toHaveBeenCalledTimes(1);
  });
});
