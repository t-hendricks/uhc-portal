import React from 'react';
import { shallow } from 'enzyme';

import CustomerCloudSubscriptionModal from '../CreateOSDForm/FormSections/BillingModelSection/CustomerCloudSubscriptionModal';

describe('Customer Cloud Subscription modal;', () => {
  let wrapper;

  it('should render for AWS', () => {
    wrapper = shallow(
      <CustomerCloudSubscriptionModal cloudProviderID="aws" closeModal={jest.fn()} />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render for GCP', () => {
    wrapper = shallow(
      <CustomerCloudSubscriptionModal cloudProviderID="gcp" closeModal={jest.fn()} />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
