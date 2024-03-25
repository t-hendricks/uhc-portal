import React from 'react';

import { waitFor, render, screen } from '~/testUtils';
import wizardConnector from '~/components/clusters/wizards/common/WizardConnector';

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
  jest.useFakeTimers({
    legacyFakeTimers: true, // TODO 'modern'
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  describe('Show spinner when refreshing/loading OIDC configurations', () => {
    it('shows spinner initially', async () => {
      const ConnectedCustomerOIDCConfiguration = wizardConnector(CustomerOIDCConfiguration);
      render(<ConnectedCustomerOIDCConfiguration {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'Loading... Refresh' })).toBeDisabled();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Refresh/ })).toHaveAttribute(
          'aria-disabled',
          'false',
        );
      });
    });

    it('hides spinner after OIDC refresh is done', async () => {
      const ConnectedCustomerOIDCConfiguration = wizardConnector(CustomerOIDCConfiguration);
      render(<ConnectedCustomerOIDCConfiguration {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Refresh/ })).toHaveAttribute(
          'aria-disabled',
          'false',
        );
      });

      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  describe('OIDC config select ', () => {
    it('shows with no options in dropdown', async () => {
      const ConnectedCustomerOIDCConfiguration = wizardConnector(CustomerOIDCConfiguration);
      render(<ConnectedCustomerOIDCConfiguration {...defaultProps} />);

      // Check while data is still loading
      expect(await screen.findByText(/No OIDC configurations found/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Refresh/ })).toHaveAttribute(
          'aria-disabled',
          'false',
        );
      });
    });

    it('shows search in select oidc config id dropdown', async () => {
      const ConnectedCustomerOIDCConfiguration = wizardConnector(CustomerOIDCConfiguration);
      const { user } = render(<ConnectedCustomerOIDCConfiguration {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Refresh/ })).toHaveAttribute(
          'aria-disabled',
          'false',
        );
      });

      expect(await screen.findByText(/select a config id/i)).toBeInTheDocument();

      const selectDropdown = screen.getByRole('button', { name: 'Options menu' });
      await user.click(selectDropdown);
      expect(await screen.findByPlaceholderText('Filter by config ID')).toBeInTheDocument();
    });
  });
});
