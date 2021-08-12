import React from 'react';
import { shallow } from 'enzyme';

import fixtures from '../../../__test__/ClusterDetails.fixtures';

import InsightsAdvisor from './InsightsAdvisor';
import Chart from './Chart';

describe('<InsightsAdvisor />', () => {
  let widgetWrapper;
  let chartWrapper;
  let chartDonutWrapper;

  beforeEach(() => {
    widgetWrapper = shallow(<InsightsAdvisor insightsData={fixtures.insightsData} />);
    chartWrapper = shallow(<Chart entries={[['1', 0], ['2', 1], ['3', 0], ['4', 2]]} issueCount={3} />);
    chartDonutWrapper = chartWrapper.find('ChartDonut');
  });

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
    expect(chartDonutWrapper.prop('colorScale')).toStrictEqual(['#a30000', '#ec7a08', '#f0ab00', '#e7f1fa']);
  });
});
