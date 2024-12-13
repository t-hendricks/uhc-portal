import React from 'react';

import { render, screen } from '~/testUtils';

import { mockedClusters } from './mocks/clusterListTable.mock';
import ClusterListTable from './ClusterListTable';

const initialProps = {
  clusters: mockedClusters,
  openModal: () => {},
  isPending: false,
  refreshFunc: () => {},
  isClustersDataPending: false,
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

  it('show status when still fetching cluster details but status is  known', () => {
    const newProps = {
      ...initialProps,
      isClustersDataPending: true,
      clusters: [{ ...mockedClusters[0] }],
    };
    render(<ClusterListTable {...newProps} />);

    // Get the text of the first data row and the second cell - this is the status cell
    const row = screen.getAllByRole('row')[1];
    expect(row.getElementsByTagName('td')[1]).toHaveTextContent('Ready');
  });

  it('does not show status when still fetching cluster details and status is not known', () => {
    const newProps = {
      ...initialProps,
      isClustersDataPending: true,
      clusters: [{ ...mockedClusters[0], state: undefined }],
    };
    render(<ClusterListTable {...newProps} />);

    // Get the text of the first data row and the second cell - this is the status cell
    const row = screen.getAllByRole('row')[1];
    expect(row.getElementsByTagName('td')[1]).toHaveTextContent('');
  });

  it('shows unknown status when fetching cluster details is done but status is not known', () => {
    const newProps = {
      ...initialProps,
      isClustersDataPending: false,
      clusters: [{ ...mockedClusters[0], state: undefined }],
    };
    render(<ClusterListTable {...newProps} />);

    // Get the text of the first data row and the second cell - this is the status cell
    const row = screen.getAllByRole('row')[1];
    expect(row.getElementsByTagName('td')[1]).toHaveTextContent('');

    expect(
      row.getElementsByTagName('td')[1].querySelector('[ data-icon-type="unknown"]'),
    ).toBeInTheDocument();
  });
});
