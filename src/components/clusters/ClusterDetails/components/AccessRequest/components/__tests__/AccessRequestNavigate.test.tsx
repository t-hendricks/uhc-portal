import React from 'react';
import { To } from 'react-router-dom-v5-compat';

import { useGlobalState } from '~/redux/hooks';
import { checkAccessibility, render, screen } from '~/testUtils';

import AccessRequestNavigate from '../AccessRequestNavigate';

jest.mock('~/components/App/LoadingPage', () => () => <div data-testid="loading-page-mock" />);
jest.mock('~/components/App/NotFoundError', () => () => <div data-testid="not-found-error-mock" />);
jest.mock('react-router-dom-v5-compat', () => ({
  Navigate: ({ to, replace }: { to: To; replace?: boolean }) => (
    <>
      <div>to: {to}</div>
      <div>replace: {replace ? 'true' : 'false'}</div>
    </>
  ),
}));

jest.mock('react-router', () => ({
  useParams: () => ({
    id: 'id1',
  }),
}));

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));
const useGlobalStateMock = useGlobalState as jest.Mock;

describe('AccessRequestNavigate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('is accessible', () => {
    it('when error', async () => {
      // Arrange
      useGlobalStateMock.mockReturnValue({ error: true });

      // Act
      const { container } = render(<AccessRequestNavigate />);

      // Assert
      await checkAccessibility(container);
    });

    it('when empty state', async () => {
      // Arrange
      useGlobalStateMock.mockReturnValue({});

      // Act
      const { container } = render(<AccessRequestNavigate />);

      // Assert
      await checkAccessibility(container);
    });
  });

  describe('is properly rendering', () => {
    it('when error', () => {
      // Arrange
      useGlobalStateMock.mockReturnValue({ error: true });

      // Act
      render(<AccessRequestNavigate />);

      // Assert
      expect(screen.getByTestId('not-found-error-mock')).toBeInTheDocument();
    });

    it('when empty state', () => {
      // Arrange
      useGlobalStateMock.mockReturnValue({});

      // Act
      render(<AccessRequestNavigate />);

      // Assert
      expect(screen.getByTestId('loading-page-mock')).toBeInTheDocument();
    });

    it('when subscription id', () => {
      // Arrange
      useGlobalStateMock.mockReturnValue({ subscription_id: 'subscriptionId1' });

      // Act
      render(<AccessRequestNavigate />);

      // Assert
      expect(
        screen.getByText(/to: \/details\/s\/subscriptionId1#accessrequest/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/replace: true/i)).toBeInTheDocument();
    });
  });
});
