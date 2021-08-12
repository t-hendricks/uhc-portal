import React from 'react';
import { shallow } from 'enzyme';
import ClustersWithIssuesTableCard from './ClustersWithIssuesTableCard';
import { clustersWithIssues } from '../Overview.fixtures';

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
  let setClusterDetails;
  let getUnhealthyClusters;
  let wrapper;
  beforeEach(() => {
    setClusterDetails = jest.fn();
    getUnhealthyClusters = jest.fn();
    wrapper = shallow(
      <ClustersWithIssuesTableCard
        getUnhealthyClusters={getUnhealthyClusters}
        setClusterDetails={setClusterDetails}
        viewOptions={baseViewOptions}
        unhealthyClusters={unhealthyClusters}
      />,
    );
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
