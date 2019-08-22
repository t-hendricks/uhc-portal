import React from 'react';
import { shallow } from 'enzyme';
import SubscriptionStatusIndicator from './SubscriptionStatusIndicator';

describe('<SubscriptionStatusIndicator />', () => {
  it('should not crash when the cluster has no subscription info', () => {
    const wrapper = shallow(<SubscriptionStatusIndicator subscriptionInfo={undefined} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render when subscription is Ok', () => {
    const wrapper = shallow(<SubscriptionStatusIndicator subscriptionInfo={{ entitlement_status: 'Ok' }} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render when subscription is Valid', () => {
    const wrapper = shallow(<SubscriptionStatusIndicator subscriptionInfo={{ entitlement_status: 'Valid' }} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render when subscription is NotSet', () => {
    const wrapper = shallow(<SubscriptionStatusIndicator subscriptionInfo={{ entitlement_status: 'NotSet' }} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render when subscription is Overcommitted', () => {
    const wrapper = shallow(<SubscriptionStatusIndicator subscriptionInfo={{ entitlement_status: 'Overcommitted' }} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render when subscription is InconsistentServices', () => {
    const wrapper = shallow(<SubscriptionStatusIndicator subscriptionInfo={{ entitlement_status: 'InconsistentServices' }} />);
    expect(wrapper).toMatchSnapshot();
  });
});
