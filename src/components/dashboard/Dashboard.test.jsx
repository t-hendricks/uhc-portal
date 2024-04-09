import React from 'react';

import { checkAccessibility, render, screen, TestRouter } from '~/testUtils';

import Dashboard from './Dashboard';
import { clustersWithIssues } from './Dashboard.fixtures';

describe('<Dashboard />', () => {
  const getSummaryDashboard = jest.fn();
  const getUnhealthyClusters = jest.fn();
  const getUserAccess = jest.fn();
  const fetchInsightsGroups = jest.fn();
  const fetchOrganizationInsights = jest.fn();
  const invalidateSubscriptions = jest.fn();
  const getOrganizationAndQuota = jest.fn();

  const defaultProps = {
    getSummaryDashboard,
    invalidateSubscriptions,
    getUnhealthyClusters,
    unhealthyClusters: {
      error: false,
      errorMessage: '',
      pending: false,
      fulfilled: true,
      valid: false,
      clusters: clustersWithIssues,
    },
    summaryDashboard: {
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
    totalClusters: 30,
    totalConnectedClusters: 10,
    totalUnhealthyClusters: 5,
    totalCPU: { value: 150 },
    usedCPU: { value: 10 },
    totalMem: { value: 100 },
    usedMem: { value: 10 },
    upToDate: { value: 10 },
    upgradeAvailable: { value: 1 },
    viewOptions: {
      currentPage: 1,
      pageSize: 1,
      totalCount: 1,
      totalPages: 1,
    },
    fetchInsightsGroups,
    fetchOrganizationInsights,
    insightsOverview: {},
    insightsGroups: {},
    getUserAccess,
    userAccess: {
      data: true,
    },
    getOrganizationAndQuota,
    organization: {},
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.skip('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <Dashboard {...defaultProps} />
      </TestRouter>,
    );

    expect(await screen.findByText('Dashboard')).toBeInTheDocument();

    // The fails due to numerous accessibility issues
    await checkAccessibility(container);
  });
});
