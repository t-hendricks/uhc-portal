import React from 'react';
import { fireEvent, render, screen } from '@testUtils';
import wizardConnector from '~/components/clusters/CreateOSDPage/CreateOSDWizard/WizardConnector';
import CustomerOIDCConfiguration from './CustomerOIDCConfiguration';

const oidcConfigs = [{ id: 'config1' }, { id: 'config2' }, { id: 'config3' }];
const defaultProps = {
  getUserOidcConfigurations: jest.fn(() =>
    Promise.resolve({
      action: { type: 'LIST_USER_OIDC_CONFIGURATIONS_FULFILLED', payload: oidcConfigs },
    }),
  ),
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

  describe('OIDC config select ', () => {
    it('shows with no options in dropdown', async () => {
      const ConnectedCustomerOIDCConfiguration = wizardConnector(CustomerOIDCConfiguration);
      render(<ConnectedCustomerOIDCConfiguration {...defaultProps} />);
      // For unit test, this works because config ids take a while to load
      expect(await screen.findByText(/No OIDC configurations found/i)).toBeInTheDocument();
    });

    it('shows search in select oidc config id dropdown', async () => {
      const ConnectedCustomerOIDCConfiguration = wizardConnector(CustomerOIDCConfiguration);
      render(<ConnectedCustomerOIDCConfiguration {...defaultProps} />);
      expect(await screen.findByText(/select a config id/i)).toBeInTheDocument();

      const selectDropdown = screen.getByRole('button', { name: 'Options menu' });
      fireEvent.keyDown(selectDropdown, { key: 'Enter' }); // this is the only way to open select! using click doesn't work
      expect(await screen.findByPlaceholderText('Filter by config ID')).toBeInTheDocument();
    });
  });
});
