import React from 'react';

import { render, screen } from '~/testUtils';

import { mockedClusters } from './mocks/clusterListTable.mock';
import ClusterListTable from './ClusterListTable';

const initialProps = {
  clusters: mockedClusters,
  openModal: () => {},
  isPending: false,
};

describe('<ClusterListTable />', () => {
  it('shows skeletons when is pending ', () => {
    const newProps = { ...initialProps, isPending: true };
    render(<ClusterListTable {...newProps} />);
    expect(screen.getAllByText('loading cluster')).toHaveLength(10);
    expect(screen.queryByText('myAWSCluster')).not.toBeInTheDocument();
    expect(screen.queryByText('No clusters found.')).not.toBeInTheDocument();
  });

  it('shows empty state when there are no clusters and it is no longer pending', () => {
    const newProps = { ...initialProps, isPending: false, clusters: [] };
    render(<ClusterListTable {...newProps} />);
    expect(screen.getByText('No clusters found.')).toBeInTheDocument();
    expect(screen.queryByText('loading cluster')).not.toBeInTheDocument();
    expect(screen.queryByText('myAWSCluster')).not.toBeInTheDocument();
  });
});
