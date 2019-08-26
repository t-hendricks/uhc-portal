import React from 'react';
import { shallow } from 'enzyme';
import SubscriptionStatusIndicator from './SubscriptionStatusIndicator';

describe('<SubscriptionStatusIndicator />', () => {
  it('should not crash when the cluster has no subscription info', () => {
    const cluster = {
      managed: false,
    };
    const wrapper = shallow(<SubscriptionStatusIndicator cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when subscription is Ok', () => {
    const cluster = {
      managed: false,
      subscription: {
        entitlement_status: 'Ok',
      },
    };
    const wrapper = shallow(<SubscriptionStatusIndicator cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when subscription is Valid', () => {
    const cluster = {
      managed: false,
      subscription: {
        entitlement_status: 'Valid',
      },
    };
    const wrapper = shallow(<SubscriptionStatusIndicator cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when subscription is NotSet', () => {
    const cluster = {
      managed: false,
      subscription: {
        entitlement_status: 'NotSet',
      },
    };
    const wrapper = shallow(<SubscriptionStatusIndicator cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when subscription is Overcommitted', () => {
    const cluster = {
      managed: false,
      subscription: {
        entitlement_status: 'Overcommitted',
      },
    };
    const wrapper = shallow(<SubscriptionStatusIndicator cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when subscription is InconsistentServices', () => {
    const cluster = {
      managed: false,
      subscription: {
        entitlement_status: 'InconsistentServices',
      },
    };
    const wrapper = shallow(<SubscriptionStatusIndicator cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when subscription is blank and cluster is managed', () => {
    const cluster = {
      managed: true,
      subscription: {
        entitlement_status: '',
      },
    };
    const wrapper = shallow(<SubscriptionStatusIndicator cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });
});
