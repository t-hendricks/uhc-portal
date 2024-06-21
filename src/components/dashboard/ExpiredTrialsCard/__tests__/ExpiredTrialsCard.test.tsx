import React from 'react';
import * as reactRedux from 'react-redux';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { useGlobalState } from '~/redux/hooks';
import { checkAccessibility, render, screen, TestRouter, within } from '~/testUtils';

import { getSubscriptions } from '../../../../redux/actions/subscriptionsActions';
import { expiredTrials } from '../../Dashboard.fixtures';
import ExpiredTrialsCard from '../ExpiredTrialsCard';

import { baseViewOptions, initialState } from './ExpiredTrialsCard.fixtures';

jest.mock('../../../../redux/actions/subscriptionsActions', () => ({
  getSubscriptions: jest.fn(),
}));
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

const getSubscriptionsMock = getSubscriptions as jest.Mock;
const useGlobalStateMock = useGlobalState as jest.Mock;

describe('<ExpiredTrialsCard />', () => {
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    getSubscriptionsMock.mockReturnValue('getSubscriptionsMockResponse');
    useDispatchMock.mockReturnValue(mockedDispatch);
  });

  describe('When the request was not fulfilled', () => {
    it('return null', () => {
      // Arrange
      useGlobalStateMock.mockReturnValueOnce(initialState);
      useGlobalStateMock.mockReturnValueOnce(baseViewOptions);

      // Act
      const { container } = render(
        <TestRouter>
          <CompatRouter>
            <ExpiredTrialsCard />
          </CompatRouter>
        </TestRouter>,
      );

      // Assert
      expect(container).toBeEmptyDOMElement();
    });

    it('calls getSubscriptions on mount', () => {
      // Arrange
      useGlobalStateMock.mockReturnValueOnce(initialState);
      useGlobalStateMock.mockReturnValueOnce(baseViewOptions);
      expect(getSubscriptions).not.toHaveBeenCalled();

      // Act
      render(<ExpiredTrialsCard />);

      // Assert
      expect(getSubscriptions).toHaveBeenCalled();
    });
  });

  describe('When data is available', () => {
    it('is accessible', async () => {
      // Arrange
      useGlobalStateMock.mockReturnValueOnce({
        ...initialState,
        items: expiredTrials,
      });
      useGlobalStateMock.mockReturnValueOnce(baseViewOptions);

      // Act
      const { container } = render(
        <TestRouter>
          <CompatRouter>
            <ExpiredTrialsCard />
          </CompatRouter>
        </TestRouter>,
      );

      // Assert
      expect(await screen.findByText('Expired Trials')).toBeInTheDocument();
      expect(await screen.findByRole('grid')).toBeInTheDocument();
      await checkAccessibility(container);
    });
    it('kebab button properly enabled/disabled', () => {
      // Arrange
      useGlobalStateMock.mockReturnValueOnce({
        ...initialState,
        items: expiredTrials,
      });
      useGlobalStateMock.mockReturnValueOnce(baseViewOptions);

      // Act
      render(
        <TestRouter>
          <CompatRouter>
            <ExpiredTrialsCard />
          </CompatRouter>
        </TestRouter>,
      );

      // Assert
      expect(
        within(screen.getByRole('row', { name: /my cluster/i })).getByRole('button', {
          name: /kebab toggle/i,
        }),
      ).toBeInTheDocument();
      expect(
        within(screen.getByRole('row', { name: /my cluster/i })).getByRole('button', {
          name: /kebab toggle/i,
        }),
      ).not.toHaveAttribute('disabled');
      expect(
        within(screen.getByRole('row', { name: /other cluster/i })).getByRole('button', {
          name: /kebab toggle/i,
        }),
      ).toBeInTheDocument();
      expect(
        within(screen.getByRole('row', { name: /other cluster/i })).getByRole('button', {
          name: /kebab toggle/i,
        }),
      ).toHaveAttribute('disabled');
    });
  });
});
