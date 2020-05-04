import React from 'react';
import { shallow } from 'enzyme';
import Overview from './Overview';

const dashboardState = {
  fulfilled: true,
  pending: false,
  summary: {
    clusters_total: [
      { value: 30 },
    ],
    connected_clusters_total: [
      { value: 10 },
    ],
    clusters_with_issues_total: [
      { value: 5 },
    ],
    sum_total_cpu: [
      { value: 150 },
    ],
    sum_used_cpu: [
      { value: 10 },
    ],
    sum_total_memory: [
      { value: 100 },
    ],
    sum_used_memory: [
      { value: 10 },
    ],
    clusters_up_to_date_total: [
      { value: 10 },
    ],
    clusters_upgrade_available_total: [
      { value: 1 },
    ],
  },
};

describe('<Overview />', () => {
  let getSummaryDashboard;
  let wrapper;
  beforeAll(() => {
    getSummaryDashboard = jest.fn();
    wrapper = shallow(
      <Overview
        getSummaryDashboard={getSummaryDashboard}
        invalidateSubscriptions={jest.fn()}
        dashboards={dashboardState}
      />,
    );
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
