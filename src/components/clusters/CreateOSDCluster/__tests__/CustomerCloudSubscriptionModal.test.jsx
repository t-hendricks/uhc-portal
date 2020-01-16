import React from 'react';
import { shallow } from 'enzyme';

import CustomerCloudSubscriptionModal from '../components/BillingModel/CustomerCloudSubscriptionModal';

describe('Customer Cloud Subscription modal;', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallow(<CustomerCloudSubscriptionModal closeModal={jest.fn()} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
