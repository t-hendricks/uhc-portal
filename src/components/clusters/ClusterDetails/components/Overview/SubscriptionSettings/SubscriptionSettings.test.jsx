import React from 'react';
import { shallow } from 'enzyme';

import SubscriptionSettings from './SubscriptionSettings';
import * as Fixtures from './SubscriptionSettings.fixtures';


describe('<SubscriptionSettings />', () => {
  it('should render for OCP', () => {
    Fixtures.subscription.plan.id = 'OCP';
    const wrapper = shallow(<SubscriptionSettings {...Fixtures} />);
    expect(wrapper.find('[variant="link"]').length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render if not OCP', () => {
    Fixtures.subscription.plan.id = 'OSD';
    const wrapper = shallow(<SubscriptionSettings {...Fixtures} />);
    expect(wrapper).toMatchObject({});
  });

  it('should hide Edit', () => {
    Fixtures.subscription.plan.id = 'OCP';
    Fixtures.canEdit = false;
    const wrapper = shallow(<SubscriptionSettings {...Fixtures} />);
    expect(wrapper.find('[variant="link"]').length).toEqual(0);
  });
});
