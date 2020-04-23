import React from 'react';
import { shallow } from 'enzyme';
import { clustersConstants } from '../../redux/constants';
import Overview from './Overview';
import { clustersWithIssues } from './Overview.fixtures';

const dashboardClusters = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: false,
  valid: false,
  clusters: clustersWithIssues,
};

const baseViewOptions = {
  currentPage: 1,
  pageSize: 5,
  totalCount: 0,
  totalPages: 0,
  filter: {
    healthState: clustersConstants.CLUSTERS_STATE_UNHEALTHY,
  },
};

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
  let setClusterDetails;
  let fetchClustersUsingParams;
  let wrapper;
  beforeAll(() => {
    getSummaryDashboard = jest.fn();
    setClusterDetails = jest.fn();
    fetchClustersUsingParams = jest.fn();
    wrapper = shallow(
      <Overview
        fetchClustersUsingParams={fetchClustersUsingParams}
        getSummaryDashboard={getSummaryDashboard}
        setClusterDetails={setClusterDetails}
        dashboards={dashboardState}
        viewOptions={baseViewOptions}
        dashboardClusters={dashboardClusters}
      />,
    );
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
