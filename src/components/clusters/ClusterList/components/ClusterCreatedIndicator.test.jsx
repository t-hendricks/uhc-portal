import React from 'react';
import { shallow } from 'enzyme';
import ClusterCreatedIndicator from './ClusterCreatedIndicator';
import {
  subscriptionSupportLevels,
  subscriptionSettings,
} from '../../../../common/subscriptionTypes';

const { SUPPORT_LEVEL, EVALUATION_EXPIRATION_DATE } = subscriptionSettings;

describe('<ClusterCreatedIndicator />', () => {
  it('should not crash when the cluster has no subscription info', () => {
    const cluster = {
      managed: false,
      subscription: {
        [EVALUATION_EXPIRATION_DATE]: '2020-01-01T12:00:00Z',
      },
    };
    const wrapper = shallow(<ClusterCreatedIndicator cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should show created date when cluster is OSD', () => {
    const creationTimeStamp = '2020-01-01T12:00:00Z';
    const cluster = {
      managed: true,
      subscription: {
        [SUPPORT_LEVEL]: subscriptionSupportLevels.SELF_SUPPORT,
      },
      creation_timestamp: creationTimeStamp,
    };
    const wrapper = shallow(<ClusterCreatedIndicator cluster={cluster} />);
    expect(wrapper.text()).toEqual('01 Jan 2020');
  });

  it('should show created date when it has a valid support', () => {
    const creationTimeStamp = '2020-01-01T12:00:00Z';
    const cluster = {
      managed: false,
      subscription: {
        [SUPPORT_LEVEL]: subscriptionSupportLevels.PREMIUM,
      },
      creation_timestamp: creationTimeStamp,
    };
    const wrapper = shallow(<ClusterCreatedIndicator cluster={cluster} />);
    expect(wrapper.text()).toEqual('01 Jan 2020');
  });

  it('should render when cluster is in 60-day trial', () => {
    const creationTimeStamp = '2020-01-01T00:00:00Z';
    const cluster = {
      managed: false,
      subscription: {
        [SUPPORT_LEVEL]: subscriptionSupportLevels.EVAL,
      },
      creation_timestamp: creationTimeStamp,
    };
    const wrapper = shallow(<ClusterCreatedIndicator cluster={cluster} />);
    expect(wrapper.find('Popover').length).toEqual(1);
  });

  it('should render when trial expires', () => {
    const creationTimeStamp = '2020-01-01T00:00:00Z';
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
