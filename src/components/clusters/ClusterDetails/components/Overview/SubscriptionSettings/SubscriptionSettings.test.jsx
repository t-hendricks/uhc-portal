import React from 'react';
import { shallow } from 'enzyme';

import SubscriptionSettings from './SubscriptionSettings';
import * as Fixtures from './SubscriptionSettings.fixtures';


describe('<SubscriptionSettings />', () => {
  const editButtonSelector = '[variant="link"]';

  it('should render for OCP', () => {
    Fixtures.subscription.plan.id = 'OCP';
    const wrapper = shallow(<SubscriptionSettings {...Fixtures} />);
    expect(wrapper.find(editButtonSelector).length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render if not OCP', () => {
    Fixtures.subscription.plan.id = 'OSD';
    const wrapper = shallow(<SubscriptionSettings {...Fixtures} />);
    expect(wrapper).toMatchObject({});
  });

  it('should show contact sales', () => {
    Fixtures.subscription.plan.id = 'OCP';
    Fixtures.canSubscribeOCP = false;
    const wrapper = shallow(<SubscriptionSettings {...Fixtures} />);
    expect(wrapper.find(editButtonSelector).length).toEqual(0);
    expect(wrapper.find('[target="_blank"]').length).toEqual(1);
  });

  it('should hide Edit', () => {
    Fixtures.subscription.plan.id = 'OCP';
    Fixtures.canEdit = false;
    const wrapper = shallow(<SubscriptionSettings {...Fixtures} />);
    expect(wrapper.find(editButtonSelector).length).toEqual(0);
  });
});
