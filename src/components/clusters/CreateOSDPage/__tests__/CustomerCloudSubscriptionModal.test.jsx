import React from 'react';

import { screen, render, checkAccessibility } from '~/testUtils';
import CustomerCloudSubscriptionModal from '../CreateOSDForm/FormSections/BillingModelSection/CustomerCloudSubscriptionModal';

describe('Customer Cloud Subscription modal;', () => {
  const closeModal = jest.fn();

  const defaultProps = {
    closeModal,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render for AWS', async () => {
    const { container } = render(
      <CustomerCloudSubscriptionModal cloudProviderID="aws" {...defaultProps} />,
    );
    expect(
      screen.getByText('It is also recommended that you have at least Business Support from AWS', {
        exact: false,
      }),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('should render for GCP', async () => {
    const { container } = render(
      <CustomerCloudSubscriptionModal cloudProviderID="gcp" {...defaultProps} />,
    );
    expect(
      screen.getByText(
        'It is also recommended that you have at least Production support from GCP',
        {
          exact: false,
        },
      ),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
