import * as React from 'react';
import { Form, Formik } from 'formik';

import { CloudProviderType } from '~/components/clusters/wizards/osd/ClusterSettings/CloudProvider/types';
import { render, screen } from '~/testUtils';
import { SubscriptionCommonFields } from '~/types/accounts_mgmt.v1';

import { FieldId, initialValues } from '../constants';

import { MarketplaceSelectField } from './MarketplaceSelectField';

const defaultProps = {
  hasGcpQuota: true,
  hasRhmQuota: true,
};

describe('<MarketplaceSelectField />', () => {
  it('should show a placeholder', async () => {
    render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        <MarketplaceSelectField {...defaultProps} />
      </Formik>,
    );

    expect(screen.queryByText('Select your marketplace')).toBeInTheDocument();
  });

  xit('should have 2 select items', async () => {});

  xit('selecting Red Hat marketplace sets the right field value', async () => {});

  xit('selecting Google cloud marketplace sets the right field value', async () => {});

  it('shows a previously selected marketplace', async () => {
    const formValues = {
      ...initialValues,
      [FieldId.BillingModel]: SubscriptionCommonFields.cluster_billing_model.MARKETPLACE,
      [FieldId.MarketplaceSelection]:
        SubscriptionCommonFields.cluster_billing_model.MARKETPLACE_GCP,
    };
    render(
      <Formik initialValues={formValues} onSubmit={() => {}}>
        <MarketplaceSelectField {...defaultProps} />
      </Formik>,
    );

    expect(await screen.findByText('Google Cloud Marketplace')).toBeInTheDocument();
    expect(screen.queryByText('Select your marketplace')).not.toBeInTheDocument();
  });

  it('resets the marketplace value when billing model is not "on-demand" (marketplace)', async () => {
    const formValues = {
      ...initialValues,
      [FieldId.BillingModel]: SubscriptionCommonFields.cluster_billing_model.STANDARD,
      [FieldId.MarketplaceSelection]:
        SubscriptionCommonFields.cluster_billing_model.MARKETPLACE_GCP,
      [FieldId.CloudProvider]: CloudProviderType.Gcp,
    };
    const handleSubmit = jest.fn();
    const { user } = render(
      <Formik initialValues={formValues} onSubmit={handleSubmit}>
        <Form>
          <MarketplaceSelectField {...defaultProps} />
          <button type="submit">Submit</button>
        </Form>
      </Formik>,
    );

    expect(await screen.findByText('Select your marketplace')).toBeInTheDocument();
    expect(screen.queryByText('Google Cloud Marketplace')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    // checking that only the marketplace selection is reset as previously the cloud provider
    // was wrongfully reset too
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        [FieldId.BillingModel]: SubscriptionCommonFields.cluster_billing_model.STANDARD,
        [FieldId.MarketplaceSelection]: null,
        [FieldId.CloudProvider]: CloudProviderType.Gcp,
      }),
      expect.anything(),
    );
  });
});
