import React from 'react';
import { shallow } from 'enzyme';
import { Alert } from '@patternfly/react-core';

import SubscriptionCompliancy from '../components/SubscriptionCompliancy';
import fixtures from './ClusterDetails.fixtures';
import {
  subscriptionSettings,
  subscriptionSupportLevels,
} from '../../../../common/subscriptionTypes';

const { SUPPORT_LEVEL } = subscriptionSettings;
const { EVAL, STANDARD, NONE } = subscriptionSupportLevels;

describe('<SubscriptionCompliancy />', () => {
  const { OCPClusterDetails, clusterDetails, organization } = fixtures;
  const openModal = jest.fn();
  let wrapper;
  beforeEach(() => {
    const props = {
      cluster: OCPClusterDetails.cluster,
      canSubscribeOCP: false,
      organization,
      openModal,
    };
    wrapper = shallow(
      <SubscriptionCompliancy {...props} />,
    );
  });

  it('should warn during evaluation period', () => {
    const cluster = { ...OCPClusterDetails.cluster, canEdit: true };
    cluster.subscription[SUPPORT_LEVEL] = EVAL;
    cluster.subscription.capabilities = [{
      name: 'capability.cluster.subscribed_ocp',
      value: 'true',
      inherited: true,
    }];
    wrapper.setProps({ cluster }, () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Alert).length).toEqual(1);
    });
    // show diff text for non-edit users
    cluster.canEdit = false;
    wrapper.setProps({ cluster }, () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Alert).length).toEqual(1);
    });
  });

  it('should warn when evaluation is expired', () => {
    const cluster = { ...OCPClusterDetails.cluster, canEdit: true };
    cluster.subscription[SUPPORT_LEVEL] = NONE;
    cluster.subscription.capabilities = [];
    wrapper.setProps({ cluster }, () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Alert).length).toEqual(1);
    });
    // show diff text for non-edit users
    cluster.canEdit = false;
    wrapper.setProps({ cluster }, () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Alert).length).toEqual(1);
    });
  });

  it('should not render when it has a valid support', () => {
    const cluster = { ...OCPClusterDetails.cluster };
    cluster.subscription[SUPPORT_LEVEL] = STANDARD;
    wrapper.setProps({ cluster }, () => {
      expect(wrapper).toMatchObject({});
    });
  });

  it('should not render when it is not OCP', () => {
    const cluster = { ...clusterDetails.cluster };
    wrapper.setProps({ cluster }, () => {
      expect(wrapper).toMatchObject({});
    });
  });
});
