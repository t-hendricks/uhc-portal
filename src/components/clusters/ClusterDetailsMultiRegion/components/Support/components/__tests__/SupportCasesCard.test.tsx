import * as React from 'react';
import * as reactRedux from 'react-redux';

import { getSupportCases } from '~/redux/actions/supportActions';
import { useGlobalState } from '~/redux/hooks';
import { isRestrictedEnv } from '~/restrictedEnv';
import { checkAccessibility, render, screen } from '~/testUtils';

import SupportCasesCard from '../SupportCasesCard';

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));

jest.mock('~/redux/actions/supportActions', () => ({
  getSupportCases: jest.fn(),
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

const useGlobalStateMock = useGlobalState as jest.Mock;
const getSupportCasesMock = getSupportCases as jest.Mock;
const isRestrictedEnvMock = isRestrictedEnv as jest.Mock;

describe('<SupportCasesCard />', () => {
  const defaultProps = {
    subscriptionID: '1iGW3xYbKZAEdZLi207rcA1l0ob',
  };
  describe('in default environment', () => {
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    const mockedDispatch = jest.fn();
    useDispatchMock.mockReturnValue(mockedDispatch);

    beforeEach(() => {
      jest.clearAllMocks();
      isRestrictedEnvMock.mockReturnValue(false);

      // Component is rendered twice
      for (let i = 0; i < 2; i += 1) {
        useGlobalStateMock.mockReturnValueOnce({});
        useGlobalStateMock.mockReturnValueOnce({
          supportCases: {
            cases: [],
            pending: false,
            subscriptionID: '1iGW3xYbKZAEdZLi207rcA1l0ob',
          },
        });
      }
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
      expect(getSupportCasesMock).toHaveBeenCalledTimes(1);
      expect(getSupportCasesMock).toHaveBeenCalledWith('1iGW3xYbKZAEdZLi207rcA1l0ob');
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
      expect(getSupportCasesMock).toHaveBeenCalledTimes(0);
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
