import React from 'react';
import { Formik } from 'formik';

import { render, screen, waitFor } from '~/testUtils';

import { useFetchGetUserOidcConfigurations } from '../../../../../queries/RosaWizardQueries/useFetchGetUserOidcConfigurations';
import { initialValues } from '../constants';

import CustomerOIDCConfiguration from './CustomerOIDCConfiguration';

jest.mock('../../../../../queries/RosaWizardQueries/useFetchGetUserOidcConfigurations', () => ({
  useFetchGetUserOidcConfigurations: jest.fn(),
  refetchGetUserOidcConfigurations: jest.fn(),
}));

const oidcData = {
  data: {
    items: [{ id: 'config1' }, { id: 'config2' }, { id: 'config3' }],
  },
};

const defaultProps = {
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

  const mockedUseFetchGetUserOidcConfigurations = useFetchGetUserOidcConfigurations;

  describe('Refresh OIDC data button', () => {
    it('is disabled and shows spinner when data is being fetched', async () => {
      mockedUseFetchGetUserOidcConfigurations.mockReturnValue({
        data: undefined,
        isFetching: true,
        isSuccess: null,
      });

      render(buildTestComponent(<CustomerOIDCConfiguration {...defaultProps} />));

      expect(screen.getByRole('button', { name: 'Loading... Refresh' })).toBeDisabled();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('hides the spinner after oidc data is fetched and is not disabled', async () => {
      mockedUseFetchGetUserOidcConfigurations.mockReturnValue({
        data: oidcData,
        isFetching: false,
        isSuccess: true,
      });

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
    it('shows when oidc config data is being fetched', async () => {
      mockedUseFetchGetUserOidcConfigurations.mockReturnValue({
        data: undefined,
        isFetching: true,
        isSuccess: null,
      });

      render(buildTestComponent(<CustomerOIDCConfiguration {...defaultProps} />));

      // Check while data is still loading
      expect(await screen.findByText(/No OIDC configurations found/i)).toBeInTheDocument();
    });

    it('is shown and disabled when no oidc configs are returned', async () => {
      mockedUseFetchGetUserOidcConfigurations.mockReturnValue({
        data: undefined,
        isFetching: false,
        isSuccess: true,
      });

      render(buildTestComponent(<CustomerOIDCConfiguration {...defaultProps} />));

      expect(await screen.findByText(/No OIDC configurations found/i)).toBeInTheDocument();

      const selectDropdown = screen.getByRole('button', { name: 'Options menu' });

      await waitFor(() => {
        expect(selectDropdown).toBeDisabled();
      });
    });

    it('is refreshable when no oidc configs are returned', async () => {
      mockedUseFetchGetUserOidcConfigurations.mockReturnValue({
        data: undefined,
        isFetching: false,
        isSuccess: true,
      });

      render(buildTestComponent(<CustomerOIDCConfiguration {...defaultProps} />));

      expect(await screen.findByText(/No OIDC configurations found/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Refresh/ })).toHaveAttribute(
          'aria-disabled',
          'false',
        );
      });
    });

    it('shows search in select oidc config id dropdown', async () => {
      mockedUseFetchGetUserOidcConfigurations.mockReturnValue({
        data: oidcData,
        isFetching: false,
        isSuccess: true,
      });

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
