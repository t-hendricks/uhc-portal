import React from 'react';
import * as reactRedux from 'react-redux';

import { clearNotificationContacts, getNotificationContacts } from '~/redux/actions/supportActions';
import { useGlobalState } from '~/redux/hooks';
import { act, checkAccessibility, render, screen } from '~/testUtils';

import NotificationContactsCard from '../NotificationContactsCard';

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));

jest.mock('~/redux/actions/supportActions', () => ({
  clearDeleteNotificationContacts: jest.fn(),
  clearNotificationContacts: jest.fn(),
  deleteNotificationContact: jest.fn(),
  getNotificationContacts: jest.fn(),
}));

jest.mock('react-redux', () => {
  const config = {
    __esModule: true,
    ...jest.requireActual('react-redux'),
  };
  return config;
});

jest.mock('~/components/common/ErrorBox', () => () => <div data-testid="error-box" />);

const useGlobalStateMock = useGlobalState as jest.Mock;

const clearNotificationContactsMock = clearNotificationContacts as jest.Mock;
const getNotificationContactsMock = getNotificationContacts as jest.Mock;

describe('<NotificationContactsCard />', () => {
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();
  useDispatchMock.mockReturnValue(mockedDispatch);

  const defaultProps = { subscriptionID: '1iGW3xYbKZAEdZLi207rcA1l0ob', isDisabled: false };
  const emptyState = {
    notificationContacts: {},
    addContactResponse: {},
    deleteContactResponse: {},
  };

  const defaultState = {
    notificationContacts: {
      subscriptionID: defaultProps.subscriptionID,
      contacts: [
        {
          username: 'username1',
          email: 'email1',
          firstName: 'firstName1',
          lastName: 'lastName1',
          userID: 'userID1',
        },
        {
          username: 'username2',
          email: 'email2',
          firstName: 'firstName2',
          lastName: 'lastName2',
          userID: 'userID2',
        },
      ],
    },
    addContactResponse: {},
    deleteContactResponse: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('it is accessible', () => {
    it.each([[true], [false]])('isDisabled %p', async (isDisabled: boolean) => {
      // Arrange
      useGlobalStateMock.mockReturnValue(defaultState);

      // Act
      const { container } = render(
        <NotificationContactsCard {...defaultProps} isDisabled={isDisabled} />,
      );

      // Assert
      await act(async () => {
        await checkAccessibility(container);
      });
    });
  });

  it('cleans up', () => {
    // Arrange
    useGlobalStateMock.mockReturnValue(emptyState);

    // Act
    const { unmount } = render(<NotificationContactsCard {...defaultProps} />);

    // Assert
    unmount();
    expect(clearNotificationContactsMock).toHaveBeenCalledTimes(1);
  });

  it('empty content', () => {
    // Arrange
    useGlobalStateMock.mockReturnValue(emptyState);

    // Act
    render(
      <div data-testid="parent-div">
        <NotificationContactsCard {...defaultProps} />
      </div>,
    );

    // Assert
    expect(screen.getByTestId('parent-div').children.length).toBe(0);
  });

  it.each([
    [defaultProps.subscriptionID, 0],
    ['whatever the value', 1],
  ])(
    'subscriptionID: %p getNotificationContacts is called %p',
    (subscriptionID, expectedNumberOfCalls) => {
      // Arrange
      getNotificationContactsMock.mockClear();
      useGlobalStateMock.mockReturnValue({
        ...defaultState,
        notificationContacts: { subscriptionID, pending: true },
      });

      // Act
      render(<NotificationContactsCard {...defaultProps} />);

      // Assert
      expect(getNotificationContactsMock).toHaveBeenCalledTimes(expectedNumberOfCalls);
    },
  );

  it('renders what it is expected', () => {
    // Arrange
    useGlobalStateMock.mockReturnValue(defaultState);

    // Act
    render(<NotificationContactsCard {...defaultProps} />);

    // Assert
    expect(screen.getAllByRole('button', { name: /kebab toggle/i })).toHaveLength(2);
    expect(
      screen.getByRole('row', {
        name: /username1 email1 firstname1 lastname1/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('row', {
        name: /username2 email2 firstname2 lastname2/i,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('error-box')).not.toBeInTheDocument();
  });

  it('renders what it is expected with error', () => {
    // Arrange
    useGlobalStateMock.mockReturnValue({
      ...defaultState,
      deleteContactResponse: { error: 'whatever the error' },
    });

    // Act
    render(<NotificationContactsCard {...defaultProps} />);

    // Assert
    expect(screen.getByTestId('error-box')).toBeInTheDocument();
  });
});
