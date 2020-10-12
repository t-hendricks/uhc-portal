import React from 'react';
import { shallow } from 'enzyme';

import CustomerCloudSubscriptionModal from '../CreateOSDForm/FormSections/BillingModelSection/CustomerCloudSubscriptionModal';

describe('Customer Cloud Subscription modal;', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallow(<CustomerCloudSubscriptionModal cloudProviderID="aws" closeModal={jest.fn()} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
