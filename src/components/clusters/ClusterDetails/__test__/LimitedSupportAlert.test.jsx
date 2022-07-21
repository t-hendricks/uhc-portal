import React from 'react';
import { shallow } from 'enzyme';

import LimitedSupportAlert from '../components/LimitedSupportAlert';

describe('<LimitedSupportAlert />', () => {
  const reasons = [
    {
      kind: 'ClusterLimitedSupportReason',
      href: '/api/clusters_mgmt/v1/limited_support_reasons/reasonId1',
      id: 'reasonId1',
      summary: 'the version of the cluster id too far behind',
      details: 'https:://support.redhat.com/version_too_old',
      creation_time: '2021-07-23T20:19:53.053814Z',
      detection_type: 'auto',
    },
    {
      kind: 'ClusterLimitedSupportReason',
      href: '/api/clusters_mgmt/v1/limited_support_reasons/reasonId2',
      id: 'reasonId2',
      summary: 'This is another sample reason',
      details: 'https:://support.redhat.com/some_other_reason',
      creation_time: '2021-07-23T20:19:53.053814Z',
      detection_type: 'auto',
    },
  ];
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<LimitedSupportAlert limitedSupportReasons={reasons} />);
  });

  it('Limited support is not shown if no limited support warnings', () => {
    wrapper.setProps({ limitedSupportReasons: [] });
    expect(wrapper.isEmptyRender()).toBeTruthy();
  });

  it('All limited support items are shown if multiple', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy();

    expect(wrapper.find('Alert').props().title).toEqual('This cluster has limited support due to multiple reasons.');

    // Check for correct number of reasons
    expect(wrapper.find('Alert List ListItem')).toHaveLength(reasons.length);

    // Check "learn more links for each reason"
    wrapper.find('Alert List ListItem').forEach((item, index) => {
      const ExternalLink = item.find('ExternalLink');
      expect(ExternalLink).toHaveLength(1);
      expect(ExternalLink.props().href).toEqual(reasons[index].details);
    });
  });

  it('Single limited support item is shown', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy();

    wrapper.setProps({ limitedSupportReasons: [reasons[0]] });
    expect(wrapper.find('Alert').props().title).toEqual('This cluster has limited support.');

    // Check for correct number of reasons
    expect(wrapper.find('Alert List ListItem')).toHaveLength(1);

    // Check "learn more links for single reason"
    const ExternalLink = wrapper.find('Alert List ListItem ExternalLink');
    expect(ExternalLink).toHaveLength(1);
    expect(ExternalLink.props().href).toEqual(reasons[0].details);
  });

  it('Learn more link is not shown if details link is not provided', () => {
    const reason = {
      kind: 'ClusterLimitedSupportReason',
      href: '/api/clusters_mgmt/v1/limited_support_reasons/reasonId1',
      id: 'reasonId1',
      summary: 'the version of the cluster id too far behind',
      creation_time: '2021-07-23T20:19:53.053814Z',
      detection_type: 'auto',
    };

    wrapper.setProps({ limitedSupportReasons: [reason] });

    const ExternalLink = wrapper.find('Alert List ListItem ExternalLink');
    expect(ExternalLink).toHaveLength(0);
  });
});
