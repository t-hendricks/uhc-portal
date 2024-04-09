import React from 'react';
import * as reactRedux from 'react-redux';

import { normalizedProducts } from '~/common/subscriptionTypes';
import { defaultClusterFromSubscription } from '~/components/clusters/common/__tests__/defaultClusterFromSubscription.fixtures';
import { useGlobalState } from '~/redux/hooks';
import { checkAccessibility, render, screen } from '~/testUtils';

import Support from '../Support';

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));

jest.mock('~/components/common/Modal/ModalActions', () => ({
  openModal: jest.fn(),
}));

jest.mock('react-redux', () => {
  const config = {
    __esModule: true,
    ...jest.requireActual('react-redux'),
  };
  return config;
});

const useGlobalStateMock = useGlobalState as jest.Mock;

jest.mock('../components/AddNotificationContactButton', () => () => (
  <div data-testid="add-notification-contact-button" />
));

jest.mock('../components/NotificationContactsCard', () => (props: any) => (
  <div data-testid="notification-contacts-card" {...props} />
));

jest.mock('../components/SupportCasesCard', () => (props: any) => (
  <div data-testid="support-cases-card" {...props} />
));

describe('<Support />', () => {
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();
  useDispatchMock.mockReturnValue(mockedDispatch);

  describe('it is accessible', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('undefined cluster', async () => {
      // Arrange
      useGlobalStateMock.mockReturnValue({ cluster: undefined });

      // Act
      const { container } = render(<Support />);

      // Assert
      await checkAccessibility(container);
    });

    it('default cluster from subscription', async () => {
      // Arrange
      useGlobalStateMock.mockReturnValue({ cluster: defaultClusterFromSubscription });

      // Act
      const { container } = render(<Support />);

      // Assert
      await checkAccessibility(container);
    });

    it('plan type RHOIC', async () => {
      // Arrange
      useGlobalStateMock.mockReturnValue({
        cluster: {
          ...defaultClusterFromSubscription,
          subscription: {
            ...defaultClusterFromSubscription.subscription,
            plan: { type: normalizedProducts.RHOIC },
          },
        },
      });

      // Act
      const { container } = render(<Support />);

      // Assert
      await checkAccessibility(container);
    });
  });

  describe('check content', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('empty content', () => {
      // Arrange
      useGlobalStateMock.mockReturnValue({ cluster: undefined });

      // Act
      render(
        <div data-testid="parent-div">
          <Support />
        </div>,
      );

      // Assert
      expect(screen.getByTestId('parent-div').children.length).toBe(0);
    });

    it('default cluster from subscription', () => {
      // Arrange
      useGlobalStateMock.mockReturnValue({ cluster: defaultClusterFromSubscription });

      // Act
      render(<Support />);

      // Assert
      expect(screen.getByTestId('add-notification-contact-button')).toBeInTheDocument();
      expect(screen.queryByTestId('support-cases-card')).not.toBeInTheDocument();
      expect(screen.queryByTestId('notification-contacts-card')).not.toBeInTheDocument();
    });

    it('RHOIC and with subscription ID', () => {
      // Arrange
      useGlobalStateMock.mockReturnValue({
        cluster: {
          ...defaultClusterFromSubscription,
          subscription: {
            ...defaultClusterFromSubscription.subscription,
            id: 'whatevertheid',
            plan: { type: normalizedProducts.RHOIC },
          },
        },
      });

      // Act
      render(<Support />);

      // Assert
      expect(screen.getByTestId('add-notification-contact-button')).toBeInTheDocument();
      expect(screen.queryByTestId('support-cases-card')).not.toBeInTheDocument();
      expect(screen.getByTestId('notification-contacts-card')).toBeInTheDocument();
    });

    it('with subscription ID', () => {
      // Arrange
      useGlobalStateMock.mockReturnValue({
        cluster: {
          ...defaultClusterFromSubscription,
          subscription: {
            ...defaultClusterFromSubscription.subscription,
            id: 'whatevertheid',
          },
        },
      });
      // Act
      render(<Support />);

      // Assert
      expect(screen.getByTestId('add-notification-contact-button')).toBeInTheDocument();
      expect(screen.getByTestId('support-cases-card')).toBeInTheDocument();
      expect(screen.getByTestId('support-cases-card')).toHaveAttribute(
        'subscriptionid',
        'whatevertheid',
      );
      expect(screen.getByTestId('notification-contacts-card')).toBeInTheDocument();
      expect(screen.getByTestId('notification-contacts-card')).toHaveAttribute(
        'subscriptionid',
        'whatevertheid',
      );
    });

    it('without subscription ID', () => {
      // Arrange
      useGlobalStateMock.mockReturnValue({ cluster: defaultClusterFromSubscription });
      // Act
      render(<Support />);

      // Assert
      expect(screen.getByTestId('add-notification-contact-button')).toBeInTheDocument();
      expect(screen.queryByTestId('support-cases-card')).not.toBeInTheDocument();
      expect(screen.queryByTestId('notification-contacts-card')).not.toBeInTheDocument();
    });

    it('is disabled', () => {
      // Arrange
      useGlobalStateMock.mockReturnValue({ cluster: defaultClusterFromSubscription });

      // Act
      render(<Support isDisabled />);

      // Assert
      expect(screen.queryByTestId('add-notification-contact-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('support-cases-card')).not.toBeInTheDocument();
      expect(screen.queryByTestId('notification-contacts-card')).not.toBeInTheDocument();
    });
  });
});
