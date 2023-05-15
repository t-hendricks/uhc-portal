import React from 'react';
import { shallow, mount } from 'enzyme';

import fixtures from '../../../__test__/ClusterDetails.fixtures';

import InsightsAdvisor from './InsightsAdvisor';
import Chart from './Chart';

describe('<InsightsAdvisor />', () => {
  const props = {
    entries: [
      ['1', 0],
      ['2', 1],
      ['3', 0],
      ['4', 2],
    ],
    issueCount: 3,
    externalId: 'foo-bar',
  };
  const widgetWrapper = shallow(
    <InsightsAdvisor insightsData={fixtures.insightsData} externalId="foo-bar" />,
  );
  const chartWrapper = shallow(<Chart {...props} />);
  const chartDonutWrapper = chartWrapper.find('ChartDonut');
  const chartMounted = mount(<Chart {...props} />);

  it('should render the widget', () => {
    expect(widgetWrapper).toMatchSnapshot();
  });

  it('should render the chart', () => {
    expect(chartWrapper).toMatchSnapshot();
  });

  it('should show 3 issues in total', () => {
    expect(chartDonutWrapper.prop('title')).toBe('3');
  });

  it('should preserve original color scale', () => {
    expect(chartDonutWrapper.prop('colorScale')).toStrictEqual([
      '#a30000',
      '#ec7a08',
      '#f0ab00',
      '#e7f1fa',
    ]);
  });

  it('should render title links to OCP Advisor', () => {
    const links = chartMounted.find('InsightsLabelComponent > a');
    expect(links).toHaveLength(4);
    links.forEach((link, index) => {
      expect(link.props().href).toBe(
        `/openshift/insights/advisor/clusters/foo-bar?total_risk=${index + 1}`,
      );
    });
  });

  it('should render sub-title link to OCP Advisor', () => {
    const link = chartMounted.find('InsightsSubtitleComponent > a');
    expect(link).toHaveLength(1);
    expect(link.props().href).toBe('/openshift/insights/advisor/clusters/foo-bar');
  });
});
