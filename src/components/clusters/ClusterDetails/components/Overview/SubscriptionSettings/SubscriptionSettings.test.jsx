import React from 'react';
import { shallow } from 'enzyme';

import SubscriptionSettings from './SubscriptionSettings';
import * as Fixtures from './SubscriptionSettings.fixtures';
import { normalizedProducts } from '../../../../../../common/subscriptionTypes';

describe('<SubscriptionSettings />', () => {
  const editButtonSelectorEnabled = '[variant="link"][isDisabled=false]';
  const editButtonSelectorDisabled = '[variant="link"][isDisabled=true]';

  it('should render for OCP', () => {
    Fixtures.subscription.plan.id = normalizedProducts.OCP;
    Fixtures.subscription.plan.type = normalizedProducts.OCP;
    const wrapper = shallow(<SubscriptionSettings {...Fixtures} />);
    expect(wrapper.find(editButtonSelectorEnabled).length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render if not OCP', () => {
    Fixtures.subscription.plan.id = normalizedProducts.OSD;
    Fixtures.subscription.plan.type = normalizedProducts.OSD;
    const wrapper = shallow(<SubscriptionSettings {...Fixtures} />);
    expect(wrapper).toMatchObject({});
  });

  it('should show contact sales', () => {
    Fixtures.subscription.plan.id = normalizedProducts.OCP;
    Fixtures.subscription.plan.type = normalizedProducts.OCP;
    Fixtures.canSubscribeOCP = false;
    const wrapper = shallow(<SubscriptionSettings {...Fixtures} />);
    expect(wrapper.find(editButtonSelectorDisabled).length).toEqual(1);
    expect(wrapper.find('ExternalLink').length).toEqual(1);
  });

  it('should hide Edit', () => {
    Fixtures.subscription.plan.id = normalizedProducts.OCP;
    Fixtures.subscription.plan.type = normalizedProducts.OCP;
    Fixtures.canEdit = false;
    const wrapper = shallow(<SubscriptionSettings {...Fixtures} />);
    expect(wrapper.find(editButtonSelectorEnabled).length).toEqual(0);
  });
});
