import React from 'react';
import { shallow } from 'enzyme';

import SubscriptionCompliancy from '../components/SubscriptionCompliancy';
import { clusterDetails, organization } from './ClusterDetails.fixtures';

describe('<SubscriptionCompliancy />', () => {
  let wrapper;
  beforeEach(() => {
    const props = { cluster: clusterDetails.cluster, organization };
    wrapper = shallow(
      <SubscriptionCompliancy {...props} />,
    );
  });

  it('should render', () => {
    const c = clusterDetails.cluster;
    c.subscriptionInfo.entitlement_status = 'NotSet';
    wrapper.setProps({ cluster: c }, () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  it('should warn when subscription is not attached', () => {
    const c = clusterDetails.cluster;
    c.subscriptionInfo.entitlement_status = 'NotSet';
    wrapper.setProps({ cluster: c }, () => {
      expect(wrapper.find('Alert').length).toEqual(1);
    });
  });

  it('should warn when cluster is overcommitting resources', () => {
    const c = clusterDetails.cluster;
    c.subscriptionInfo.entitlement_status = 'Overcommitted';
    wrapper.setProps({ cluster: c }, () => {
      expect(wrapper.find('Alert').length).toEqual(1);
    });
  });

  it('should warn when subscriptions attached are inconsistent', () => {
    const c = clusterDetails.cluster;
    c.subscriptionInfo.entitlement_status = 'InconsistentServices';
    wrapper.setProps({ cluster: c }, () => {
      expect(wrapper.find('Alert').length).toEqual(1);
    });
  });

  it('should not warn when user is not a paying customer', () => {
    const c = clusterDetails.cluster;
    c.subscriptionInfo.entitlement_status = 'NotSet';
    const org = organization;
    organization.details.ebs_account_id = undefined;
    wrapper.setProps({ cluster: c, organization: org }, () => {
      expect(wrapper.find('Alert').length).toEqual(0);
    });
  });
});
