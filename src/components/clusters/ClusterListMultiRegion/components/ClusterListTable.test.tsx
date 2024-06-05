import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { render, screen, TestRouter, waitFor, within } from '~/testUtils';

import { mockedClusters } from './mocks/clusterListTable.mock';
import ClusterListTable, { columns } from './ClusterListTable';

const initialProps = {
  clusters: mockedClusters,
  openModal: () => {},
  isPending: false,
};

const checkCellValue = (expected: any[], keyToTest: string, cellIndex: number) => {
  const nameColumnIndex = Object.keys(columns).findIndex((column) => column === 'name');

  within(screen.getByTestId('clusterListTableBody'))
    .getAllByRole('row')
    .forEach((row, index) => {
      const cells = row.querySelectorAll('td');
      expect(cells[nameColumnIndex]).toHaveTextContent(expected[index].name);
      expect(cells[cellIndex]).toHaveTextContent(expected[index][keyToTest]);
    });
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

  it('displays clusters sorted by create date', async () => {
    const { user } = render(
      <TestRouter>
        <CompatRouter>
          <ClusterListTable {...initialProps} />
        </CompatRouter>{' '}
      </TestRouter>,
    );

    const expected = [
      { name: 'aCluster', date: '25 May 2024' },
      { name: 'myAWSCluster', date: '20 May 2024' },
      { name: 'zCluster', date: '25 Apr 2024' },
    ];
    const createDateColumnIndex = Object.keys(columns).findIndex((column) => column === 'created');

    // Verify name and created cells
    checkCellValue(expected, 'date', createDateColumnIndex);

    await user.click(screen.getByRole('button', { name: 'Created' }));

    // Check that the order has been reversed
    expected.reverse();
    checkCellValue(expected, 'date', createDateColumnIndex);
  });

  it('sorts by name', async () => {
    const { user } = render(
      <TestRouter>
        <CompatRouter>
          <ClusterListTable {...initialProps} />
        </CompatRouter>{' '}
      </TestRouter>,
    );

    const nameColumnIndex = Object.keys(columns).findIndex((column) => column === 'name');

    // Sort Ascending
    await user.click(screen.getByRole('button', { name: 'Name' }));

    const expected = [{ name: 'aCluster' }, { name: 'myAWSCluster' }, { name: 'zCluster' }];

    checkCellValue(expected, 'name', nameColumnIndex);

    // Check that the order has been reversed
    await user.click(screen.getByRole('button', { name: 'Name' }));
    expected.reverse();
    checkCellValue(expected, 'name', nameColumnIndex);
  });

  it('sorts by status', async () => {
    const { user } = render(
      <TestRouter>
        <CompatRouter>
          <ClusterListTable {...initialProps} />
        </CompatRouter>{' '}
      </TestRouter>,
    );

    const statusColumnIndex = Object.keys(columns).findIndex((column) => column === 'status');

    // Sort Ascending
    await user.click(screen.getByRole('button', { name: 'Status' }));

    const expected = [
      { name: 'aCluster', status: 'Installing' },
      { name: 'myAWSCluster', status: 'Ready' },
      { name: 'zCluster', status: 'Ready' },
    ];

    checkCellValue(expected, 'status', statusColumnIndex);

    // Check that the order has been reversed
    await user.click(screen.getByRole('button', { name: 'Status' }));
    expected.reverse();
    checkCellValue(expected, 'status', statusColumnIndex);
  });

  it('sorts by type', async () => {
    const { user } = render(
      <TestRouter>
        <CompatRouter>
          <ClusterListTable {...initialProps} />
        </CompatRouter>{' '}
      </TestRouter>,
    );

    const typeColumnIndex = Object.keys(columns).findIndex((column) => column === 'type');

    // Sort Ascending
    await user.click(screen.getByRole('button', { name: 'Type' }));

    const expected = [
      { name: 'aCluster', type: 'OSD' },
      { name: 'myAWSCluster', type: 'ROSA' },
      { name: 'zCluster', type: 'ROSA' },
    ];

    checkCellValue(expected, 'type', typeColumnIndex);

    // Check that the order has been reversed
    await user.click(screen.getByRole('button', { name: 'Type' }));
    expected.reverse();
    checkCellValue(expected, 'type', typeColumnIndex);
  });

  it('sorts by version', async () => {
    const { user } = render(
      <TestRouter>
        <CompatRouter>
          <ClusterListTable {...initialProps} />
        </CompatRouter>{' '}
      </TestRouter>,
    );

    const versionColumnIndex = Object.keys(columns).findIndex((column) => column === 'version');

    // Sort Ascending
    await user.click(screen.getByRole('button', { name: 'Version' }));

    const expected = [
      { name: 'myAWSCluster', version: '4.15.7' },
      { name: 'zCluster', version: '4.15.8' },
      { name: 'aCluster', version: '4.16.8' },
    ];

    checkCellValue(expected, 'version', versionColumnIndex);

    // Check that the order has been reversed
    await user.click(screen.getByRole('button', { name: 'Version' }));
    expected.reverse();
    checkCellValue(expected, 'version', versionColumnIndex);
  });

  it('sorts by version when version is N/A', async () => {
    const noVersionClusterA = {
      ...mockedClusters[0],
      id: 'aMyNACluster',
      openshift_version: undefined,
      subscription: { ...mockedClusters[0].subscription, display_name: 'aMyNACluster' },
    };

    const noVersionClusterB = {
      ...mockedClusters[0],
      id: 'zMyNACluster',
      openshift_version: undefined,
      subscription: { ...mockedClusters[0].subscription, display_name: 'zMyNACluster' },
    };

    const newClusters = [noVersionClusterB, ...mockedClusters, noVersionClusterA];

    const newProps = { ...initialProps, clusters: newClusters };

    const { user } = render(
      <TestRouter>
        <CompatRouter>
          <ClusterListTable {...newProps} />
        </CompatRouter>{' '}
      </TestRouter>,
    );

    const versionColumnIndex = Object.keys(columns).findIndex((column) => column === 'version');

    // Sort Ascending
    await user.click(screen.getByRole('button', { name: 'Version' }));

    const expected = [
      { name: 'aMyNACluster', version: 'N/A' },
      { name: 'zMyNACluster', version: 'N/A' },
      { name: 'myAWSCluster', version: '4.15.7' },
      { name: 'zCluster', version: '4.15.8' },
      { name: 'aCluster', version: '4.16.8' },
    ];

    checkCellValue(expected, 'version', versionColumnIndex);

    // Check that the order has been reversed
    await user.click(screen.getByRole('button', { name: 'Version' }));
    expected.reverse();

    await waitFor(() => {
      expect(screen.getAllByText('aMyNACluster')).toHaveLength(1);
    });
    checkCellValue(expected, 'version', versionColumnIndex);
  });

  it('sorts by provider', async () => {
    const { user } = render(
      <TestRouter>
        <CompatRouter>
          <ClusterListTable {...initialProps} />
        </CompatRouter>{' '}
      </TestRouter>,
    );

    const providerColumnIndex = Object.keys(columns).findIndex((column) => column === 'provider');

    // Sort Ascending
    await user.click(screen.getByRole('button', { name: 'Provider (Region)' }));

    const expected = [
      { name: 'zCluster', provider: 'AWS (aa-my-region)' },
      { name: 'myAWSCluster', provider: 'AWS (us-west-2)' },
      { name: 'aCluster', provider: 'GCP (us-east-1)' },
    ];

    checkCellValue(expected, 'provider', providerColumnIndex);

    // Check that the order has been reversed
    await user.click(screen.getByRole('button', { name: 'Provider (Region)' }));
    expected.reverse();
    checkCellValue(expected, 'provider', providerColumnIndex);
  });
});
