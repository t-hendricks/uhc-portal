import React from 'react';
import { shallow } from 'enzyme';
import Overview from './Overview';
import { clustersWithIssues } from './Overview.fixtures';

const dashboardState = {
  summary: {
    fulfilled: true,
    pending: false,
    metrics: {
      clusters_total: [{ value: 30 }],
      connected_clusters_total: [{ value: 10 }],
      unhealthy_clusters_total: [{ value: 5 }],
      sum_total_cpu: [{ value: 150 }],
      sum_used_cpu: [{ value: 10 }],
      sum_total_memory: [{ value: 100 }],
      sum_used_memory: [{ value: 10 }],
      clusters_up_to_date_total: [{ value: 10 }],
      clusters_upgrade_available_total: [{ value: 1 }],
    },
    error: false,
  },
  unhealthyClusters: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: true,
    valid: false,
    clusters: clustersWithIssues,
  },
  insightsOverview: {},
  insightsGroups: {},
};

describe('<Overview />', () => {
  let getSummaryDashboard;
  let getUnhealthyClusters;
  let getUserAccess;
  let wrapper;
  let viewOptions;
  let fetchInsightsGroups;
  let fetchOrganizationInsights;
  let userAccess;
  beforeEach(() => {
    getSummaryDashboard = jest.fn();
    getUnhealthyClusters = jest.fn();
    getUserAccess = jest.fn();
    fetchInsightsGroups = jest.fn();
    fetchOrganizationInsights = jest.fn();
    viewOptions = {
      currentPage: 1,
      pageSize: 1,
      totalCount: 1,
      totalPages: 1,
    };
    userAccess = {
      data: true,
    };
    wrapper = shallow(
      <Overview
        getSummaryDashboard={getSummaryDashboard}
        invalidateSubscriptions={jest.fn()}
        getUnhealthyClusters={getUnhealthyClusters}
        unhealthyClusters={dashboardState.unhealthyClusters}
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
        viewOptions={viewOptions}
        fetchInsightsGroups={fetchInsightsGroups}
        fetchOrganizationInsights={fetchOrganizationInsights}
        insightsOverview={dashboardState.insightsOverview}
        insightsGroups={dashboardState.insightsGroups}
        getUserAccess={getUserAccess}
        userAccess={userAccess}
        getOrganizationAndQuota={jest.fn()}
        organization={{}}
      />,
    );
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
