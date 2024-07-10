import * as React from 'react';

import { defaultClusterFromSubscription } from '~/components/clusters/common/__tests__/defaultClusterFromSubscription.fixtures';
import { useFetchSupportCases } from '~/queries/ClusterDetailsQueries/ClusterSupportTab/useFetchSupportCases';
import { isRestrictedEnv } from '~/restrictedEnv';
import { checkAccessibility, render, screen } from '~/testUtils';

import SupportCasesCard from '../SupportCasesCard';

jest.mock('~/queries/ClusterDetailsQueries/ClusterSupportTab/useFetchSupportCases', () => ({
  useFetchSupportCases: jest.fn(),
}));

jest.mock('react-redux', () => {
  const config = {
    __esModule: true,
    ...jest.requireActual('react-redux'),
  };
  return config;
});

jest.mock('~/restrictedEnv', () => ({
  isRestrictedEnv: jest.fn(),
  SUPPORT_CASE_URL: 'SUPPORT_CASE_URL_VALUE',
}));

const isRestrictedEnvMock = isRestrictedEnv as jest.Mock;
const mockedUseFetchSupportCases = useFetchSupportCases as jest.Mock;

describe('<SupportCasesCard />', () => {
  const defaultProps = {
    cluster: defaultClusterFromSubscription,
    subscriptionID: '1iGW3xYbKZAEdZLi207rcA1l0ob',
  };
  describe('in default environment', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      isRestrictedEnvMock.mockReturnValue(false);

      mockedUseFetchSupportCases.mockReturnValue({
        supportCases: {
          cases: [],
          pending: false,
          subscriptionID: '1iGW3xYbKZAEdZLi207rcA1l0ob',
        },
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });
    });

    it('is accessible. Emtpy cluster', async () => {
      // Act
      const { container } = render(<SupportCasesCard {...defaultProps} />);

      // Assert
      await checkAccessibility(container);
    });

    it('shows support cases table', () => {
      // Act
      render(<SupportCasesCard {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('support-cases-table')).toBeInTheDocument();
      expect(useFetchSupportCases).toHaveBeenCalledTimes(1);
      expect(useFetchSupportCases).toHaveBeenCalledWith('1iGW3xYbKZAEdZLi207rcA1l0ob', false);
    });

    it('Support case btn links to Red Hat', () => {
      // Act
      render(<SupportCasesCard {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('support-case-btn')).toHaveAttribute(
        'href',
        expect.stringMatching(/access.redhat.com/),
      );
    });
  });

  describe('in Restricted env', () => {
    beforeAll(() => {
      jest.clearAllMocks();
      isRestrictedEnvMock.mockReturnValue(true);
    });

    it('does not show support cases table', () => {
      // Act
      render(<SupportCasesCard {...defaultProps} />);

      // Assert
      expect(screen.queryByTestId('support-cases-table')).not.toBeInTheDocument();

      // The hook function will be called anyway, but it will not make API call
      expect(mockedUseFetchSupportCases).toHaveBeenCalledWith('1iGW3xYbKZAEdZLi207rcA1l0ob', true);
    });

    it('Support case btn links to FedRAMP SNOW instance', () => {
      // Act
      render(<SupportCasesCard {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('support-case-btn')).toHaveAttribute(
        'href',
        'SUPPORT_CASE_URL_VALUE',
      );
    });
  });
});
