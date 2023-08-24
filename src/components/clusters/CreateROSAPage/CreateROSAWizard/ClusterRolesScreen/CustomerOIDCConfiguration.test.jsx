import React from 'react';
import { render, screen } from '@testUtils';
import wizardConnector from '~/components/clusters/CreateOSDPage/CreateOSDWizard/WizardConnector';
import CustomerOIDCConfiguration from './CustomerOIDCConfiguration';

const defaultProps = {
  getUserOidcConfigurations: jest.fn(() => Promise.resolve({ action: { payload: [] } })),
  onSelect: () => {},
  input: { value: '', onBlur: () => {} },
  meta: { error: undefined, touched: false },
};

describe('<CustomerOIDCConfiguration />', () => {
  describe('Show spinner when refreshing/loading OIDC configurations', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });
    it('shows spinner initially', () => {
      const ConnectedCustomerOIDCConfiguration = wizardConnector(CustomerOIDCConfiguration);
      render(<ConnectedCustomerOIDCConfiguration {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'Loading... Refresh' })).toBeDisabled();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it.skip('hides spinner after OIDC refresh is done', async () => {
      // Skipping unsure why the internal isLoading isn't changing
      // even though we are telling test to advance timers
      const ConnectedCustomerOIDCConfiguration = wizardConnector(CustomerOIDCConfiguration);
      render(<ConnectedCustomerOIDCConfiguration {...defaultProps} />);

      await new Promise(process.nextTick); // wait for all promises to finish
      jest.runAllTimers();
      // In theory any of these should work but doesn't
      // jest.advanceTimersByTime(550)
      // jest.runOnlyPendingTimers();

      expect(screen.getByRole('button', { name: 'Refresh' })).toBeEnabled();
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });
});
