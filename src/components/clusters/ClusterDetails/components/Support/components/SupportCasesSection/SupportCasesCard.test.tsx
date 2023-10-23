import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { mockRestrictedEnv } from '~/testUtils';
import { SUPPORT_CASE_URL } from '~/restrictedEnv';
import SupportCasesCard from './SupportCasesCard';

describe('<SupportCasesCard />', () => {
  describe('in Restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();

    afterEach(() => {
      isRestrictedEnv.mockReturnValue(false);
    });
    it('does not show support cases table', () => {
      const getSupportCases = jest.fn();
      const props = {
        supportCases: {
          cases: [],
        },
        getSupportCases,
      };
      const { rerender } = render(<SupportCasesCard {...props} />);
      expect(screen.getByTestId('support-cases-table')).toBeInTheDocument();
      expect(getSupportCases.mock.calls).toHaveLength(1);

      isRestrictedEnv.mockReturnValue(true);

      rerender(<SupportCasesCard {...props} />);
      expect(screen.queryByTestId('support-cases-table')).not.toBeInTheDocument();
      expect(getSupportCases.mock.calls).toHaveLength(1);
    });

    it('Support case btn links to FedRAMP SNOW instance', () => {
      isRestrictedEnv.mockReturnValue(true);
      const props = {
        supportCases: {
          cases: [],
        },
        getSupportCases: () => {},
      };
      render(<SupportCasesCard {...props} />);
      expect(screen.getByTestId('support-case-btn')).toHaveAttribute('href', SUPPORT_CASE_URL);
    });
  });
});
