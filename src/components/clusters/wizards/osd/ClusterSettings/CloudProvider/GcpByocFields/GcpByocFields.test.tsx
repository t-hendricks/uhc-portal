import * as React from 'react';
import { AxiosResponse } from 'axios';
import { Formik, FormikValues } from 'formik';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { waitFor } from '@testing-library/react';

import { billingModels } from '~/common/subscriptionTypes';
import { fakeWifConfigs } from '~/components/clusters/wizards/osd/ClusterSettings/CloudProvider/GcpByocFields/GcpByocFields.fixtures';
import { WifConfigList } from '~/components/clusters/wizards/osd/ClusterSettings/CloudProvider/types';
import { OSD_GCP_WIF } from '~/redux/constants/featureConstants';
import { checkAccessibility, mockUseFeatureGate, render, screen, TestRouter } from '~/testUtils';

import { FieldId, initialValues } from '../../../constants';

import { GcpByocFields, GcpByocFieldsProps } from './GcpByocFields';

const serviceAccountLabel = /service account/i;
const shortLivedCredentialsLabel = /short-lived credentials/i;
const fetchErrorMessage = 'Error retrieving WIF configurations';

export const getTestWifConfigs = () =>
  new Promise<AxiosResponse<WifConfigList>>((resolve) => {
    resolve({
      data: { items: fakeWifConfigs, page: 0, size: 3, total: 3 },
      status: 200,
      statusText: 'OK',
    } as AxiosResponse<WifConfigList>);
  });

const prepareComponent = (
  customValues?: FormikValues,
  getWifConfigService?: GcpByocFieldsProps['getWifConfigsService'],
) => (
  <TestRouter>
    <CompatRouter>
      <Formik
        initialValues={{
          ...initialValues,
          ...customValues,
        }}
        onSubmit={() => {}}
      >
        {(props) => (
          <>
            <GcpByocFields getWifConfigsService={getWifConfigService ?? getTestWifConfigs} />
            <button type="submit" onClick={() => props.handleSubmit()}>
              Submit
            </button>
          </>
        )}
      </Formik>
    </CompatRouter>
  </TestRouter>
);

describe('<GcpByocFields />', () => {
  it('is accessible', async () => {
    const { container } = render(prepareComponent());

    await checkAccessibility(container);
  });

  describe('Test billing model prerequisites', () => {
    it('should not show the Google terms prerequisite if the billing model is not marketplace-gcp', async () => {
      render(prepareComponent({ [FieldId.BillingModel]: billingModels.MARKETPLACE }));

      await waitFor(() => {
        expect(
          screen.queryByText('Have you prepared your Google account?'),
        ).not.toBeInTheDocument();
      });
    });

    it('should show the Google terms prerequisite if the billing model is marketplace-gcp', async () => {
      render(prepareComponent({ [FieldId.BillingModel]: billingModels.MARKETPLACE_GCP }));

      expect(await screen.findByText('Have you prepared your Google account?')).toBeInTheDocument();
    });
  });

  describe('Test WIF feature flag', () => {
    it('does not show the short lived credentials authentication if the WIF feature flag is off', async () => {
      mockUseFeatureGate([[OSD_GCP_WIF, false]]);
      render(prepareComponent());

      expect(await screen.findByText('GCP Service account')).toBeInTheDocument();
      expect(screen.queryByText('GCP account details')).not.toBeInTheDocument();
      expect(screen.queryByText('Authentication type')).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: shortLivedCredentialsLabel }),
      ).not.toBeInTheDocument();
      expect(screen.getByText('Service account JSON')).toBeInTheDocument();
    });
  });

  describe('Test authentication types switch (behind feature flag)', () => {
    beforeEach(() => {
      mockUseFeatureGate([[OSD_GCP_WIF, true]]);
    });
    it('should show "service account" as default auth type', async () => {
      render(prepareComponent());

      expect(
        await screen.findByRole('button', { name: shortLivedCredentialsLabel }),
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: serviceAccountLabel })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: shortLivedCredentialsLabel })).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      expect(screen.getByRole('button', { name: serviceAccountLabel })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    it('should allow switching to "service account" auth type', async () => {
      const { user } = render(prepareComponent());

      expect(
        screen.getByRole('button', { name: shortLivedCredentialsLabel, pressed: false }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: serviceAccountLabel, pressed: true }),
      ).toBeInTheDocument();

      expect(screen.getByRole('heading', { name: serviceAccountLabel })).toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: shortLivedCredentialsLabel }),
      ).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: shortLivedCredentialsLabel }));

      expect(
        screen.getByRole('button', { name: serviceAccountLabel, pressed: false }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: shortLivedCredentialsLabel, pressed: true }),
      ).toBeInTheDocument();

      expect(screen.getByRole('heading', { name: shortLivedCredentialsLabel })).toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: serviceAccountLabel })).not.toBeInTheDocument();
    });
  });

  describe('Test short lived credentials (behind feature flag)', () => {
    beforeEach(() => {
      mockUseFeatureGate([[OSD_GCP_WIF, true]]);
    });

    it('shows a loading while fetching wif configs', async () => {
      const { user } = render(
        prepareComponent({}, () => new Promise<AxiosResponse<WifConfigList>>((_resolve) => {})),
      );

      await user.click(screen.getByRole('button', { name: shortLivedCredentialsLabel }));

      expect(screen.queryByRole('button', { name: /refresh/i })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Options menu' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Options menu' })).toBeDisabled();
      expect(screen.queryByText(fetchErrorMessage)).not.toBeInTheDocument();
    });

    it('shows a list of wif configs to choose from', async () => {
      const { user } = render(prepareComponent());

      await user.click(screen.getByRole('button', { name: shortLivedCredentialsLabel }));

      expect(screen.getByRole('button', { name: 'Options menu' })).toBeInTheDocument();
      expect(screen.queryByText(fetchErrorMessage)).not.toBeInTheDocument();

      expect(await screen.findByText('Select a configuration')).toBeInTheDocument();

      await user.click(
        screen.getByRole('button', {
          name: 'Options menu',
        }),
      );
      expect(await screen.findAllByRole('option')).toHaveLength(fakeWifConfigs.length);

      fakeWifConfigs.forEach((config) => {
        expect(
          screen.getByRole('option', {
            name: `${config.display_name} ${config.id}`,
          }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole('option', {
          name: `${fakeWifConfigs[0].display_name} ${fakeWifConfigs[0].id}`,
        }),
      );

      expect(screen.queryByRole('option')).not.toBeInTheDocument();
      expect(await screen.findByText(`${fakeWifConfigs[0].display_name}`)).toBeInTheDocument();
    });

    it('shows a message if no wif configs are available', async () => {
      const { user } = render(
        prepareComponent(
          undefined,
          () =>
            new Promise<AxiosResponse<WifConfigList>>((resolve) => {
              resolve({
                data: { items: [], page: 0, size: 0, total: 0 },
                status: 200,
                statusText: 'OK',
              } as unknown as AxiosResponse<WifConfigList>);
            }),
        ),
      );

      await user.click(screen.getByRole('button', { name: shortLivedCredentialsLabel }));

      expect(screen.getByRole('button', { name: 'Options menu' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Options menu' })).toBeDisabled();
      expect(screen.queryByText(fetchErrorMessage)).not.toBeInTheDocument();
      expect(await screen.findByText('No WIF configurations found')).toBeInTheDocument();
    });

    it('shows an alert when an error occurs while fetching wif configurations', async () => {
      const { user } = render(
        prepareComponent(
          undefined,
          () =>
            new Promise<AxiosResponse<WifConfigList>>((_resolve, reject) => {
              // eslint-disable-next-line prefer-promise-reject-errors
              reject({
                response: {
                  status: 500,
                  statusText: '',
                  config: {},
                  headers: {},
                  data: {},
                },
              });
            }),
        ),
      );

      await user.click(screen.getByRole('button', { name: shortLivedCredentialsLabel }));

      expect(await screen.findByText('No WIF configurations found')).toBeInTheDocument();
      expect(await screen.findByText(fetchErrorMessage)).toBeInTheDocument();
    });

    it('should show validation errors when required information is not provided', async () => {
      const { user } = render(prepareComponent());

      await user.click(screen.getByRole('button', { name: shortLivedCredentialsLabel }));

      expect(screen.getByRole('button', { name: 'Options menu' })).toBeInTheDocument();
      expect(await screen.findByText('Select a configuration')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(await screen.findByText('Select a configuration')).toBeInTheDocument();

      expect(
        await screen.findByText(
          /acknowledge that you have read and completed all prerequisites\./i,
        ),
      ).toBeInTheDocument();

      expect(await screen.findByText('Wif configuration is required')).toBeInTheDocument();
    });

    it('should allow to progress when required information is provided', async () => {
      const { user } = render(prepareComponent());

      await user.click(screen.getByRole('button', { name: shortLivedCredentialsLabel }));

      expect(screen.getByRole('button', { name: 'Options menu' })).toBeInTheDocument();
      expect(await screen.findByText('Select a configuration')).toBeInTheDocument();

      await user.click(
        screen.getByRole('button', {
          name: 'Options menu',
        }),
      );
      await user.click(
        screen.getByRole('option', {
          name: `${fakeWifConfigs[0].display_name} ${fakeWifConfigs[0].id}`,
        }),
      );
      await user.click(
        screen.getByRole('checkbox', {
          name: "I've read and completed all the prerequisites and am ready to continue creating my cluster.",
        }),
      );
      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(
        screen.queryByText(/acknowledge that you have read and completed all prerequisites\./i),
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Wif configuration is required')).not.toBeInTheDocument();
    });
  });
});
