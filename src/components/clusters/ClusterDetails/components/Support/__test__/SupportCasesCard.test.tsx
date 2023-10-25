import * as React from 'react';
import { render, screen, mockRestrictedEnv } from '@testUtils';
import { SUPPORT_CASE_URL } from '~/restrictedEnv';

import SupportCasesCard from '../components/SupportCasesSection/SupportCasesCard';
import { baseProps } from './Support.fixtures';

describe('<SupportCasesCard />', () => {
  describe('in default environment', () => {
    it('shows support cases table', () => {
      const getSupportCases = jest.fn();

      const testPropsWithSpy = {
        ...baseProps,
        getSupportCases,
      };

      render(<SupportCasesCard {...testPropsWithSpy} />);
      expect(screen.getByTestId('support-cases-table')).toBeInTheDocument();
      expect(getSupportCases.mock.calls).toHaveLength(1);
    });

    it('Support case btn links to Red Hat', () => {
      render(<SupportCasesCard {...baseProps} />);
      expect(screen.getByTestId('support-case-btn')).toHaveAttribute(
        'href',
        expect.stringMatching(/access.redhat.com/),
      );
    });
  });

  describe('in Restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();
    beforeAll(() => {
      isRestrictedEnv.mockReturnValue(true);
    });

    afterAll(() => {
      isRestrictedEnv.mockReturnValue(false);
    });

    it('does not show support cases table', () => {
      const getSupportCases = jest.fn();

      const testPropsWithSpy = {
        ...baseProps,
        getSupportCases,
      };

      render(<SupportCasesCard {...testPropsWithSpy} />);
      expect(screen.queryByTestId('support-cases-table')).not.toBeInTheDocument();
      expect(getSupportCases.mock.calls).toHaveLength(0);
    });

    it('Support case btn links to FedRAMP SNOW instance', () => {
      render(<SupportCasesCard {...baseProps} />);
      expect(screen.getByTestId('support-case-btn')).toHaveAttribute('href', SUPPORT_CASE_URL);
    });
  });
});
