import React from 'react';
import { Formik } from 'formik';

import { render, screen, waitFor } from '~/testUtils';

import { initialValues } from '../constants';

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

const buildTestComponent = (children, formValues = {}) => (
  <Formik
    initialValues={{
      ...initialValues,
      ...formValues,
    }}
    onSubmit={() => {}}
  >
    {children}
  </Formik>
);

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
      render(buildTestComponent(<CustomerOIDCConfiguration {...defaultProps} />));

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
      render(buildTestComponent(<CustomerOIDCConfiguration {...defaultProps} />));
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
      render(buildTestComponent(<CustomerOIDCConfiguration {...defaultProps} />));

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
      const { user } = render(buildTestComponent(<CustomerOIDCConfiguration {...defaultProps} />));
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
