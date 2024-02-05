import React from 'react';
import { render, screen, checkAccessibility, TestRouter } from '~/testUtils';
import ClustersWithIssuesTableCard from './ClustersWithIssuesTableCard';
import { clustersWithIssues } from '../Dashboard.fixtures';

const unhealthyClusters = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: true,
  valid: false,
  clusters: [],
  subscriptions: clustersWithIssues,
};

const baseViewOptions = {
  currentPage: 1,
  pageSize: 5,
  totalCount: 0,
  totalPages: 0,
  filter: {
    healthState: 'unhealthy',
  },
};

describe('<ClustersWithIssuesTableCard />', () => {
  const setClusterDetails = jest.fn();
  const getUnhealthyClusters = jest.fn();

  const defaultProps = {
    getUnhealthyClusters,
    setClusterDetails,
    viewOptions: baseViewOptions,
    unhealthyClusters,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <ClustersWithIssuesTableCard {...defaultProps} />
      </TestRouter>,
    );

    expect(await screen.findByText('Clusters with issues')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
