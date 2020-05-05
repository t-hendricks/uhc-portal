import React from 'react';
import { shallow } from 'enzyme';
import Overview from './Overview';

const dashboardState = {
  summary: {
    fulfilled: true,
    pending: false,
    metrics: {
      clusters_total: [
        { value: 30 },
      ],
      connected_clusters_total: [
        { value: 10 },
      ],
      unhealthy_clusters_total: [
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
        summaryDashboard={dashboardState.summary}
        totalClusters={dashboardState.summary.metrics.clusters_total[0].value}
        totalConnectedClusters={dashboardState.summary.metrics.connected_clusters_total[0].value}
        totalUnhealthyClusters={dashboardState.summary.metrics.unhealthy_clusters_total[0].value}
        totalCPU={dashboardState.summary.metrics.sum_total_cpu[0]}
        usedCPU={dashboardState.summary.metrics.sum_used_cpu[0]}
        totalMem={dashboardState.summary.metrics.sum_total_memory[0]}
        usedMem={dashboardState.summary.metrics.sum_used_memory[0]}
        upToDate={dashboardState.summary.metrics.clusters_up_to_date_total[0]}
        upgradeAvailable={dashboardState.summary.metrics.clusters_upgrade_available_total[0]}
      />,
    );
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
