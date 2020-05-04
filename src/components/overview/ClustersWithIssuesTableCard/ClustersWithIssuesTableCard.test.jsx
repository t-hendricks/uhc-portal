import React from 'react';
import { shallow } from 'enzyme';
import ClustersWithIssuesTableCard from './ClustersWithIssuesTableCard';
import { clustersWithIssues } from '../Overview.fixtures';

const dashboardClusters = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: true,
  valid: false,
  clusters: clustersWithIssues,
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
  let setClusterDetails;
  let fetchClustersUsingParams;
  let wrapper;
  beforeAll(() => {
    setClusterDetails = jest.fn();
    fetchClustersUsingParams = jest.fn();
    wrapper = shallow(
      <ClustersWithIssuesTableCard
        fetchClustersUsingParams={fetchClustersUsingParams}
        setClusterDetails={setClusterDetails}
        viewOptions={baseViewOptions}
        dashboardClusters={dashboardClusters}
      />,
    );
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
