import React from 'react';
import { shallow } from 'enzyme';

import SubscriptionAndSupport from '../SubscriptionAndSupport';

describe('SubscriptionAndSupport', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<SubscriptionAndSupport />);
    expect(wrapper).toMatchSnapshot();
  });
});
