import React from 'react';
import { shallow } from 'enzyme';
import { Alert } from '@patternfly/react-core';

import SubscriptionCompliancy from '../components/SubscriptionCompliancy';
import { clusterDetails, organization } from './ClusterDetails.fixtures';
import {
  subscriptionSettings,
  subscriptionSupportLevels,
} from '../../../../common/subscriptionTypes';


const { SUPPORT_LEVEL } = subscriptionSettings;
const { EVAL, STANDARD, NONE } = subscriptionSupportLevels;

describe('<SubscriptionCompliancy />', () => {
  let wrapper;
  beforeEach(() => {
    const props = { cluster: clusterDetails.cluster, organization };
    wrapper = shallow(
      <SubscriptionCompliancy {...props} />,
    );
  });

  it('should warn during evaluation period', () => {
    const c = clusterDetails.cluster;
    c.subscription[SUPPORT_LEVEL] = EVAL;
    c.canEdit = true;
    wrapper.setProps({ cluster: c }, () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Alert).length).toEqual(1);
    });
    // show diff text for non-edit users
    c.canEdit = false;
    wrapper.setProps({ cluster: c }, () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Alert).length).toEqual(1);
    });
  });

  it('should warn when evaluation is expired', () => {
    const c = clusterDetails.cluster;
    c.subscription[SUPPORT_LEVEL] = NONE;
    c.canEdit = true;
    wrapper.setProps({ cluster: c }, () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Alert).length).toEqual(1);
    });
    // show diff text for non-edit users
    c.canEdit = false;
    wrapper.setProps({ cluster: c }, () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Alert).length).toEqual(1);
    });
  });

  it('should not render when it has a valid support', () => {
    const c = clusterDetails.cluster;
    c.subscription[SUPPORT_LEVEL] = STANDARD;
    wrapper.setProps({ cluster: c }, () => {
      expect(wrapper).toMatchObject({});
    });
  });

  it('should not render when it is not OCP', () => {
    const c = clusterDetails.cluster;
    c.subscription.plan.id = 'OSD';
    wrapper.setProps({ cluster: c }, () => {
      expect(wrapper).toMatchObject({});
    });
  });
});
