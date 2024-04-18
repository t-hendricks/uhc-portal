import React from 'react';
import * as reactRedux from 'react-redux';
import { getReport, getSources } from '~/redux/actions/costActions';
import { useGlobalState } from '~/redux/hooks';
import { checkAccessibility, render, screen } from '~/testUtils';
import CostCard from '../CostCard';
import {
  availableState,
  initialState,
  initialStateNoMeta,
  initialStateNoSources,
} from './CostCard.fixtures';

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));

jest.mock('~/redux/actions/costActions', () => ({
  getReport: jest.fn(),
  getSources: jest.fn(),
}));

jest.mock('react-redux', () => {
  const config = {
    __esModule: true,
    ...jest.requireActual('react-redux'),
  };
  return config;
});

const useGlobalStateMock = useGlobalState as jest.Mock;
const getReportMock = getReport as jest.Mock;
const getSourcesMock = getSources as jest.Mock;

jest.mock('../CostSummary', () => () => <div>CostSummary</div>);
jest.mock('../CostEmptyState', () => () => (
  <div data-testid="cost-cost-empty-state">CostEmptyState</div>
));

describe('<CostCard />', () => {
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();
  useDispatchMock.mockReturnValue(mockedDispatch);

  describe('When no source providers are available', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it.each([
      ['with meta', initialState],
      ['without meta', initialStateNoMeta],
    ])('is accessible. %p', async (title, state) => {
      // Arrange
      useGlobalStateMock.mockReturnValue(state);

      // Act
      const { container } = render(<CostCard />);

      // Assert
      await checkAccessibility(container);
    });

    it.each([
      ['with meta', initialState],
      ['without meta', initialStateNoMeta],
    ])('is expected content. %p', async (title, state) => {
      // Arrange
      useGlobalStateMock.mockReturnValue(state);

      // Act
      render(<CostCard />);

      // Assert
      expect(screen.getByText('Cost Management')).toBeInTheDocument();
      expect(screen.getByText(/costemptystate/i)).toBeInTheDocument();

      expect(screen.queryByText(/costsummary/i)).not.toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: /view more in cost management/i }),
      ).not.toBeInTheDocument();
    });

    it('is accessible. without sources', async () => {
      // Arrange
      useGlobalStateMock.mockReturnValue(initialStateNoSources);

      // Act
      const { container } = render(<CostCard />);

      // Assert
      expect(screen.getByText('Cost Management')).toBeInTheDocument();
      expect(screen.getByText(/costsummary/i)).toBeInTheDocument();

      expect(
        screen.queryByRole('link', { name: /view more in cost management/i }),
      ).not.toBeInTheDocument();
      expect(screen.queryByText(/costemptystate/i)).not.toBeInTheDocument();

      await checkAccessibility(container);
    });
  });

  describe('When cost report is available', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('is accessible. with meta', async () => {
      // Arrange
      useGlobalStateMock.mockReturnValue(availableState);

      // Act
      const { container } = render(<CostCard />);

      // Assert
      await checkAccessibility(container);
    });

    it('is expected content', () => {
      // Arrange
      useGlobalStateMock.mockReturnValue(availableState);
      expect(getSourcesMock).not.toHaveBeenCalled();
      expect(getReportMock).not.toHaveBeenCalled();

      // Act
      render(<CostCard />);

      // Assert
      expect(screen.getByText('Cost Management')).toBeInTheDocument();
      expect(screen.getByText(/costsummary/i)).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /view more in cost management/i }),
      ).toBeInTheDocument();

      expect(screen.queryByText(/costemptystate/i)).not.toBeInTheDocument();

      expect(getSourcesMock).toHaveBeenCalled();
      expect(getReportMock).toHaveBeenCalled();
    });
  });
});
