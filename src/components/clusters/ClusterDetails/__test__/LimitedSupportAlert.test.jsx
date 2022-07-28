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
      details: 'More details about the version being too far behind the supported version',
      creation_time: '2021-07-23T20:19:53.053814Z',
      detection_type: 'auto',
    },
    {
      kind: 'ClusterLimitedSupportReason',
      href: '/api/clusters_mgmt/v1/limited_support_reasons/reasonId2',
      id: 'reasonId2',
      summary: 'This is another sample reason',
      details: 'This is the detailed information about another sample reason',
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
    expect(wrapper.find('Alert DescriptionListGroup')).toHaveLength(reasons.length);

    // Check for summary and details for each reason
    wrapper.find('Alert DescriptionListGroup').forEach((item, index) => {
      const summary = item.find('DescriptionListTerm');
      const details = item.find('DescriptionListDescription');

      expect(summary.children().text()).toEqual(reasons[index].summary);
      expect(details.children().text()).toEqual(reasons[index].details);
    });
  });

  it('No link is shown if neither ROSA nor OSD', () => {
    expect(wrapper.find('Alert').props().actionLinks).toBeNull();
  });

  it('OSD link is shown for OSD cluster', () => {
    wrapper.setProps({ isOSD: true });
    expect(wrapper.find('Alert').props().actionLinks).not.toBeNull();
    expect(wrapper.find('Alert').props().actionLinks.props.href).toEqual('https://docs.openshift.com/dedicated/osd_architecture/osd_policy/osd-service-definition.html#limited-support_osd-service-definition');
  });

  it('ROSA link is shown for ROSA cluster', () => {
    wrapper.setProps({ isROSA: true });
    expect(wrapper.find('Alert').props().actionLinks).not.toBeNull();
    expect(wrapper.find('Alert').props().actionLinks.props.href).toEqual('https://docs.openshift.com/rosa/rosa_architecture/rosa_policy_service_definition/rosa-service-definition.html#rosa-limited-support_rosa-service-definition');
  });
});
