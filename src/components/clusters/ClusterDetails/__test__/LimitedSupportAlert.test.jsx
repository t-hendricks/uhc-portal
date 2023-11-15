import React from 'react';
import { shallow } from 'enzyme';

import LimitedSupportAlert from '../components/LimitedSupportAlert';

// eslint-disable-next-line react/prop-types
jest.mock('~/common/MarkdownParser', () => ({ children }) => (
  <div data-testid="markdownparser-link-mock">{children}</div>
));

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
    {
      kind: 'ClusterLimitedSupportReason',
      href: '/api/clusters_mgmt/v1/limited_support_reasons/reasonId3',
      id: 'reasonId3',
      summary: 'This is another sample reason',
      details: '<a href="https://redhat.com">redhat</a>',
      creation_time: '2021-07-23T20:19:53.053814Z',
      detection_type: 'auto',
    },
  ];

  it('Limited support is not shown if no limited support warnings', () => {
    const wrapper = shallow(<LimitedSupportAlert limitedSupportReasons={reasons} />);
    wrapper.setProps({ limitedSupportReasons: [] });
    expect(wrapper.isEmptyRender()).toBeTruthy();
  });

  it('All limited support items are shown if multiple', () => {
    const wrapper = shallow(<LimitedSupportAlert limitedSupportReasons={reasons} />);
    expect(wrapper.isEmptyRender()).toBeFalsy();

    expect(wrapper.find('Alert').props().title).toEqual(
      'This cluster has limited support due to multiple reasons.',
    );

    // Check for correct number of reasons
    expect(wrapper.find('Alert DescriptionListGroup')).toHaveLength(reasons.length);

    // Check for summary and details for each reason
    wrapper.find('Alert DescriptionListGroup').forEach((item) => {
      const summary = item.find('DescriptionListTerm');
      const details = item.find('DescriptionListDescription');

      expect(summary.children().length).toEqual(1);
      expect(details.children().length).toEqual(1);
    });
  });

  it.each([
    [
      'simple reason 1',
      [reasons[0]],
      reasons[0].summary,
      'More details about the version being too far behind the supported version',
    ],
    [
      'simple reason 2',
      [reasons[1]],
      reasons[1].summary,
      'This is the detailed information about another sample reason',
    ],
    [
      'reason with html',
      [reasons[2]],
      reasons[2].summary,
      '&lt;a href=&quot;https://redhat.com&quot;&gt;redhat&lt;/a&gt;',
    ],
  ])(
    'All limited support items are shown if multiple. %p',
    (title, reasons, expectedSumary, expextedHtml) => {
      const wrapper = shallow(<LimitedSupportAlert limitedSupportReasons={reasons} />);

      expect(wrapper.isEmptyRender()).toBeFalsy();
      expect(wrapper.find('Alert').props().title).toEqual('This cluster has limited support.');
      // Check for correct number of reasons
      expect(wrapper.find('Alert DescriptionListGroup')).toHaveLength(reasons.length);

      // Check for summary and details for each reason
      wrapper.find('Alert DescriptionListGroup').forEach((item) => {
        const summary = item.find('DescriptionListTerm');
        const details = item.find('DescriptionListDescription');

        expect(summary.children().text()).toEqual(expectedSumary);
        expect(details.children().text()).toEqual('< />');
        expect(details.children().html()).toEqual(
          `<div data-testid="markdownparser-link-mock">${expextedHtml}</div>`,
        );
      });
    },
  );

  it('No link is shown if neither ROSA nor OSD', () => {
    const wrapper = shallow(<LimitedSupportAlert limitedSupportReasons={reasons} />);
    expect(wrapper.find('Alert').props().actionLinks).toBeNull();
  });

  it('OSD link is shown for OSD cluster', () => {
    const wrapper = shallow(<LimitedSupportAlert limitedSupportReasons={reasons} />);
    wrapper.setProps({ isOSD: true });
    expect(wrapper.find('Alert').props().actionLinks).not.toBeNull();
    expect(wrapper.find('Alert').props().actionLinks.props.href).toEqual(
      'https://docs.openshift.com/dedicated/osd_architecture/osd_policy/osd-service-definition.html#limited-support_osd-service-definition',
    );
  });

  it('ROSA link is shown for ROSA cluster', () => {
    const wrapper = shallow(<LimitedSupportAlert limitedSupportReasons={reasons} />);
    wrapper.setProps({ isROSA: true });
    expect(wrapper.find('Alert').props().actionLinks).not.toBeNull();
    expect(wrapper.find('Alert').props().actionLinks.props.href).toEqual(
      'https://docs.openshift.com/rosa/rosa_architecture/rosa_policy_service_definition/rosa-service-definition.html#rosa-limited-support_rosa-service-definition',
    );
  });
});
