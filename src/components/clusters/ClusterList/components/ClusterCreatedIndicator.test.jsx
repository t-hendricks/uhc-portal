import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import ClusterCreatedIndicator from './ClusterCreatedIndicator';
import {
  subscriptionSupportLevels,
  subscriptionSettings,
} from '../../../../common/subscriptionTypes';

const { SUPPORT_LEVEL } = subscriptionSettings;

describe('<ClusterCreatedIndicator />', () => {
  it('should not crash when the cluster has no subscription info', () => {
    const cluster = {
      managed: false,
    };
    const wrapper = shallow(<ClusterCreatedIndicator cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should show created date when cluster is OSD', () => {
    const creationTimeStamp = moment().format();
    const cluster = {
      managed: true,
      subscription: {
        [SUPPORT_LEVEL]: subscriptionSupportLevels.SELF_SUPPORT,
      },
      creation_timestamp: creationTimeStamp,
    };
    const wrapper = shallow(<ClusterCreatedIndicator cluster={cluster} />);
    expect(wrapper.text()).toEqual(moment(creationTimeStamp).format('DD MMM YYYY'));
  });

  it('should show created date when it has a valid support', () => {
    const creationTimeStamp = moment().format();
    const cluster = {
      managed: false,
      subscription: {
        [SUPPORT_LEVEL]: subscriptionSupportLevels.PREMIUM,
      },
      creation_timestamp: creationTimeStamp,
    };
    const wrapper = shallow(<ClusterCreatedIndicator cluster={cluster} />);
    expect(wrapper.text()).toEqual(moment(creationTimeStamp).format('DD MMM YYYY'));
  });

  it('should render when cluster is in 60-day trial', () => {
    const creationTimeStamp = moment().format();
    const cluster = {
      managed: false,
      subscription: {
        [SUPPORT_LEVEL]: subscriptionSupportLevels.EVAL,
      },
      creation_timestamp: creationTimeStamp,
    };
    const wrapper = shallow(<ClusterCreatedIndicator cluster={cluster} />);
    expect(wrapper.find('Popover').length).toEqual(1);
    expect(wrapper.html()).toMatch(/60-day trial/);
  });

  it('should render when trial expires', () => {
    const creationTimeStamp = moment().format();
    const cluster = {
      managed: false,
      subscription: {
        [SUPPORT_LEVEL]: subscriptionSupportLevels.NONE,
      },
      creation_timestamp: creationTimeStamp,
    };
    const wrapper = shallow(<ClusterCreatedIndicator cluster={cluster} />);
    expect(wrapper.find('Popover').length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });
});
