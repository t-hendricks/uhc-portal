import React from 'react';
import { MemoryRouter } from 'react-router';
import { CompatRouter } from 'react-router-dom-v5-compat';

import * as usePreviousProps from '~/hooks/usePreviousProps';
import * as useFetchClusters from '~/queries/ClusterListQueries/useFetchClusters';
import { mockRestrictedEnv, render, screen, waitFor, within, withState } from '~/testUtils';

import { normalizedProducts } from '../../../common/subscriptionTypes';
import { viewConstants } from '../../../redux/constants';
import fixtures, { funcs } from '../ClusterDetailsMultiRegion/__tests__/ClusterDetails.fixtures';

import { columns } from './components/ClusterListTable';
import { mockedClusters } from './components/mocks/clusterListTable.mock';
import ClusterList from './ClusterList';

// Unsure why usePreviousProps isn't working - mocking for now
jest.spyOn(usePreviousProps, 'usePreviousProps').mockImplementation((value) => value);

// Mocking useFetchClusters due to the complexity of this custom hook
// the useFetchClusters hook has its own unit tests to ensure it returns the correct values
const mockedGetFetchedClusters = jest.spyOn(useFetchClusters, 'useFetchClusters');

const clusterRows = () => within(screen.getByTestId('clusterListTableBody')).getAllByRole('row');

describe('<ClusterList />', () => {
  const props = {
    cloudProviders: fixtures.cloudProviders,
    machineTypes: {
      fulfilled: true,
      pending: false,
    },
    organization: fixtures.organization,
    pendingOrganizationAccessRequests: {},
    organizationId: 'whateverTheOrganizationId',
    closeModal: jest.fn(),
    openModal: jest.fn(),
    clearGlobalError: jest.fn(),
    getOrganizationAndQuota: jest.fn(),
    getMachineTypes: jest.fn(),
    getCloudProviders: jest.fn(),
  };

  const emptyStateText = "Let's create your first cluster";

  it('shows skeleton while loading and no data is returned yet', () => {
    mockedGetFetchedClusters.mockReturnValue({
      data: undefined,
      isLoading: true,
      errors: [],
    });
    render(
      <MemoryRouter>
        <CompatRouter>
          <ClusterList {...props} />
        </CompatRouter>
      </MemoryRouter>,
    );

    const numberOfSkeletonRows = 10;

    expect(screen.getAllByTestId('skeleton')).toHaveLength(numberOfSkeletonRows);

    // the number of rows in the tbody tag matches the number of skeleton rows
    expect(within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row')).toHaveLength(
      numberOfSkeletonRows,
    );

    expect(screen.getByRole('button', { name: 'Refresh' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );

    expect(within(screen.getByRole('status')).getByText('Loading...')).toBeInTheDocument(); // loading spinner
    expect(screen.queryByText(emptyStateText)).not.toBeInTheDocument();
  });

  it('shows empty state when done loading and no clusters is returned', () => {
    mockedGetFetchedClusters.mockReturnValue({
      data: { items: [] },
      isLoading: false,
      isFetching: false,
      errors: [],
    });
    render(
      <MemoryRouter>
        <CompatRouter>
          <ClusterList {...props} />
        </CompatRouter>
      </MemoryRouter>,
    );

    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Refresh' })).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument(); // loading spinner
    expect(screen.getByText(emptyStateText)).toBeInTheDocument();
  });

  it('shows data if still loading but clusters are available', () => {
    mockedGetFetchedClusters.mockReturnValue({
      data: { items: [fixtures.clusterDetails.cluster] },
      isLoading: true,
      errors: [],
    });
    render(
      <MemoryRouter>
        <CompatRouter>
          <ClusterList {...props} />
        </CompatRouter>
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: 'Refresh' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );

    expect(within(screen.getByRole('status')).getByText('Loading...')).toBeInTheDocument(); // loading spinner
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();

    expect(
      screen.getByText(fixtures.clusterDetails.cluster.subscription.display_name),
    ).toBeInTheDocument();
  });

  it('shows data and loading icon if is fetching', () => {
    mockedGetFetchedClusters.mockReturnValue({
      data: { items: [fixtures.clusterDetails.cluster] },
      isFetching: true,
      errors: [],
    });
    render(
      <MemoryRouter>
        <CompatRouter>
          <ClusterList {...props} />
        </CompatRouter>
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: 'Refresh' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );

    expect(within(screen.getByRole('status')).getByText('Loading...')).toBeInTheDocument(); // loading spinner
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();

    expect(
      screen.getByText(fixtures.clusterDetails.cluster.subscription.display_name),
    ).toBeInTheDocument();
  });

  it('shows data if done loading', () => {
    mockedGetFetchedClusters.mockReturnValue({
      data: { items: [fixtures.clusterDetails.cluster] },
      errors: [],
    });
    render(
      <MemoryRouter>
        <CompatRouter>
          <ClusterList {...props} />
        </CompatRouter>
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: 'Refresh' })).toHaveAttribute(
      'aria-disabled',
      'false',
    );

    expect(screen.queryByRole('status')).not.toBeInTheDocument(); // loading spinner
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();

    expect(
      screen.getByText(fixtures.clusterDetails.cluster.subscription.display_name),
    ).toBeInTheDocument();
  });

  it('refresh calls refresh function', async () => {
    const refetch = jest.fn();
    mockedGetFetchedClusters.mockReturnValue({
      data: { items: [fixtures.clusterDetails.cluster] },
      refetch,
      errors: [],
    });
    const { user } = render(
      <MemoryRouter>
        <CompatRouter>
          <ClusterList {...props} />
        </CompatRouter>
      </MemoryRouter>,
    );

    expect(refetch).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Refresh' }));

    expect(refetch).toHaveBeenCalled();
  });

  describe('Sorting', () => {
    const checkCellValue = (expected, keyToTest, cellIndex) => {
      const nameColumnIndex = Object.keys(columns).findIndex((column) => column === 'name');

      within(screen.getByTestId('clusterListTableBody'))
        .getAllByRole('row')
        .forEach((row, index) => {
          const cells = row.querySelectorAll('td');
          expect(cells[nameColumnIndex]).toHaveTextContent(expected[index].name);
          expect(cells[cellIndex]).toHaveTextContent(expected[index][keyToTest]);
        });
    };

    it('displays clusters sorted by create date', async () => {
      mockedGetFetchedClusters.mockReturnValue({
        data: { items: mockedClusters },
        isLoading: true,
        errors: [],
      });

      const { user } = withState({}, true).render(
        <MemoryRouter>
          <CompatRouter>
            <ClusterList {...props} />
          </CompatRouter>
        </MemoryRouter>,
      );

      const expected = [
        { name: 'aCluster', date: '25 May 2024' },
        { name: 'myAWSCluster', date: '20 May 2024' },
        { name: 'zCluster', date: '25 Apr 2024' },
      ];
      const createDateColumnIndex = Object.keys(columns).findIndex(
        (column) => column === 'created',
      );

      // Verify name and created cells
      checkCellValue(expected, 'date', createDateColumnIndex);

      await user.click(screen.getByRole('button', { name: 'Created' }));

      // Check that the order has been reversed
      expected.reverse();
      checkCellValue(expected, 'date', createDateColumnIndex);
    });

    it('sorts by name', async () => {
      mockedGetFetchedClusters.mockReturnValue({
        data: { items: mockedClusters },
        isLoading: true,
        errors: [],
      });

      const { user } = withState({}, true).render(
        <MemoryRouter>
          <CompatRouter>
            <ClusterList {...props} />
          </CompatRouter>
        </MemoryRouter>,
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
      mockedGetFetchedClusters.mockReturnValue({
        data: { items: mockedClusters },
        isLoading: true,
        errors: [],
      });

      const { user } = withState({}, true).render(
        <MemoryRouter>
          <CompatRouter>
            <ClusterList {...props} />
          </CompatRouter>
        </MemoryRouter>,
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
      mockedGetFetchedClusters.mockReturnValue({
        data: { items: mockedClusters },
        isLoading: true,
        errors: [],
      });

      const { user } = withState({}, true).render(
        <MemoryRouter>
          <CompatRouter>
            <ClusterList {...props} />
          </CompatRouter>
        </MemoryRouter>,
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
      mockedGetFetchedClusters.mockReturnValue({
        data: { items: mockedClusters },
        isLoading: true,
        errors: [],
      });

      const { user } = withState({}, true).render(
        <MemoryRouter>
          <CompatRouter>
            <ClusterList {...props} />
          </CompatRouter>
        </MemoryRouter>,
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

      mockedGetFetchedClusters.mockReturnValue({
        data: { items: newClusters },
        isLoading: true,
        errors: [],
      });

      const { user } = withState({}, true).render(
        <MemoryRouter>
          <CompatRouter>
            <ClusterList {...props} />
          </CompatRouter>
        </MemoryRouter>,
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
      mockedGetFetchedClusters.mockReturnValue({
        data: { items: mockedClusters },
        isLoading: true,
        errors: [],
      });

      const { user } = withState({}, true).render(
        <MemoryRouter>
          <CompatRouter>
            <ClusterList {...props} />
          </CompatRouter>
        </MemoryRouter>,
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

  describe('Pagination', () => {
    const initialResultsPerPage = 50;
    const pageInformationQuerySelector = '.pf-v5-c-menu-toggle__text';

    // Create a list of 200 clusters
    const mockClusters = [];
    const mockStartingCluster = fixtures.clusterDetails.cluster;
    for (let i = 1; i <= 200; i += 1) {
      const creationDate = new Date('2024-06-01T01:11:00Z');
      creationDate.setSeconds(creationDate.getSeconds() - i);

      mockClusters.push({
        ...mockStartingCluster,
        id: `cluster${i}`,
        subscription: { ...mockStartingCluster.subscription, display_name: `cluster${i}` },
        openshift_version: `4.14.${i}`,
        creation_timestamp: creationDate.toISOString(),
      });
    }

    it('The correct number of results on a page', () => {
      mockedGetFetchedClusters.mockReturnValue({
        data: { items: mockClusters },
        errors: [],
      });

      const { container } = render(
        <MemoryRouter>
          <CompatRouter>
            <ClusterList {...props} />
          </CompatRouter>
        </MemoryRouter>,
      );

      expect(clusterRows()).toHaveLength(initialResultsPerPage);
      expect(screen.getByText('cluster1')).toBeInTheDocument();
      expect(screen.getByText('cluster50')).toBeInTheDocument();

      expect(container.querySelector(pageInformationQuerySelector)).toHaveTextContent(
        '1 - 50 of 200',
      );
    });

    it('Clicking on the next page link changes the results', async () => {
      mockedGetFetchedClusters.mockReturnValue({
        data: { items: mockClusters },
        errors: [],
      });

      const { container, user } = render(
        <MemoryRouter>
          <CompatRouter>
            <ClusterList {...props} />
          </CompatRouter>
        </MemoryRouter>,
      );

      // Ensure that the "back" button is disabled:
      screen.getAllByRole('button', { name: 'Go to previous page' }).forEach((button) => {
        expect(button).toBeDisabled();
      });

      // Click on the "next" button above the table:
      await user.click(screen.getAllByRole('button', { name: 'Go to next page' })[0]);
      expect(clusterRows()).toHaveLength(initialResultsPerPage);
      expect(screen.getByText('cluster51')).toBeInTheDocument();
      expect(screen.getByText('cluster100')).toBeInTheDocument();
      expect(container.querySelector(pageInformationQuerySelector)).toHaveTextContent(
        '51 - 100 of 200',
      );

      // Ensure that the "back" button is enabled:
      screen.getAllByRole('button', { name: 'Go to previous page' }).forEach((button) => {
        expect(button).not.toBeDisabled();
      });

      // Click on the "next" button below the table:
      await user.click(screen.getAllByRole('button', { name: 'Go to next page' })[0]);
      expect(clusterRows()).toHaveLength(initialResultsPerPage);
      expect(screen.getByText('cluster101')).toBeInTheDocument();
      expect(screen.getByText('cluster150')).toBeInTheDocument();
      expect(container.querySelector(pageInformationQuerySelector)).toHaveTextContent(
        '101 - 150 of 200',
      );
    });

    it('Clicking on the previous link changes the results', async () => {
      mockedGetFetchedClusters.mockReturnValue({
        data: { items: mockClusters },
        errors: [],
      });

      const { container, user } = render(
        <MemoryRouter>
          <CompatRouter>
            <ClusterList {...props} />
          </CompatRouter>
        </MemoryRouter>,
      );

      // Go to last page:
      await user.click(screen.getByRole('button', { name: 'Go to last page' }));

      expect(clusterRows()).toHaveLength(initialResultsPerPage);

      expect(screen.getByText('cluster200')).toBeInTheDocument();

      screen.getAllByRole('button', { name: 'Go to next page' }).forEach((button) => {
        expect(button).toBeDisabled();
      });
      expect(container.querySelector(pageInformationQuerySelector)).toHaveTextContent(
        '151 - 200 of 200',
      );

      await user.click(screen.getAllByRole('button', { name: 'Go to previous page' })[0]);
      expect(screen.getByText('cluster101')).toBeInTheDocument();
      expect(screen.getByText('cluster150')).toBeInTheDocument();
      expect(container.querySelector(pageInformationQuerySelector)).toHaveTextContent(
        '101 - 150 of 200',
      );

      await user.click(screen.getAllByRole('button', { name: 'Go to previous page' })[1]);
      expect(screen.getByText('cluster51')).toBeInTheDocument();
      expect(screen.getByText('cluster100')).toBeInTheDocument();
      expect(container.querySelector(pageInformationQuerySelector)).toHaveTextContent(
        '51 - 100 of 200',
      );
    }, 80000);

    it('Changing the "per page" results changes the number of results', async () => {
      mockedGetFetchedClusters.mockReturnValue({
        data: { items: mockClusters },
        errors: [],
      });

      const { container, user } = render(
        <MemoryRouter>
          <CompatRouter>
            <ClusterList {...props} />
          </CompatRouter>
        </MemoryRouter>,
      );
      expect(clusterRows()).toHaveLength(initialResultsPerPage);
      await user.click(container.querySelector('#options-menu-bottom-toggle'));
      await user.click(screen.getByText('100 per page'));
      expect(clusterRows()).toHaveLength(100);
      expect(container.querySelector(pageInformationQuerySelector)).toHaveTextContent(
        '1 - 100 of 200',
      );
    });

    it('shows 0 of 0 when there no clusters are returned but is still loading', () => {
      mockedGetFetchedClusters.mockReturnValue({
        data: undefined,
        isLoading: true,
        errors: [],
      });

      const { container } = render(
        <MemoryRouter>
          <CompatRouter>
            <ClusterList {...props} />
          </CompatRouter>
        </MemoryRouter>,
      );

      expect(container.querySelector(pageInformationQuerySelector)).toHaveTextContent('0 - 0 of 0');
    });

    it('keeps current page when sorted', async () => {
      mockedGetFetchedClusters.mockReturnValue({
        data: { items: mockClusters },
        errors: [],
      });

      const { container, user } = render(
        <MemoryRouter>
          <CompatRouter>
            <ClusterList {...props} />
          </CompatRouter>
        </MemoryRouter>,
      );

      await user.click(screen.getAllByRole('button', { name: 'Go to next page' })[0]);

      expect(screen.getByLabelText('Current page')).toHaveValue(2);

      // sort ascending
      await user.click(screen.getByRole('button', { name: 'Version' }));
      expect(screen.getByText('4.14.51')).toBeInTheDocument();
      expect(screen.getByText('4.14.100')).toBeInTheDocument();
      expect(container.querySelector(pageInformationQuerySelector)).toHaveTextContent(
        '51 - 100 of 200',
      );
      expect(screen.getByLabelText('Current page')).toHaveValue(2);

      // sort descending
      await user.click(screen.getByRole('button', { name: 'Version' }));

      expect(screen.getByText('4.14.101')).toBeInTheDocument();
      expect(screen.getByText('4.14.150')).toBeInTheDocument();
      expect(container.querySelector(pageInformationQuerySelector)).toHaveTextContent(
        '51 - 100 of 200',
      );
      expect(screen.getByLabelText('Current page')).toHaveValue(2);
    }, 80000);
  });

  // NOTE:  These tests are marked as skip for now until filtering is re-enabled
  describe.skip('in restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();
    const onListFlagsSet = jest.fn();
    const props = {
      onListFlagsSet,
      cloudProviders: fixtures.cloudProviders,
      machineTypes: {
        fulfilled: true,
        pending: false,
      },
      organization: fixtures.organization,
      fetchClusters: jest.fn(),
      viewOptions: {
        flags: {},
        currentPage: 1,
        sorting: {
          sortField: '',
        },
      },
      clusters: [fixtures.clusterDetails.cluster],
      meta: {},
      queryParams: {},
      features: {},
      valid: true,
      pending: false,
      errorMessage: '',
      error: false,
      username: 'myUserName',
      ...funcs(),
      clearClusterDetails: jest.fn(),
      setClusterDetails: jest.fn(),
      setListFlag: jest.fn(),
      setSorting: jest.fn(),
      getMachineTypes: jest.fn(),
    };
    afterEach(() => {
      isRestrictedEnv.mockReturnValue(false);
    });

    it('should call onListFlagsSet with ROSA filter', async () => {
      isRestrictedEnv.mockReturnValue(true);
      render(
        <MemoryRouter>
          <CompatRouter>
            <ClusterList {...props} />
          </CompatRouter>
        </MemoryRouter>,
      );
      expect(onListFlagsSet).toHaveBeenCalled();
      const args = onListFlagsSet.mock.calls[0];
      expect(args[0]).toBe('subscriptionFilter');
      expect(args[1]).toStrictEqual({ plan_id: [normalizedProducts.ROSA] });
      expect(args[2]).toBe(viewConstants.CLUSTERS_VIEW);

      expect(await screen.findByRole('button', { name: 'Create cluster' })).toBeInTheDocument();
    });

    it('does not render filtering', async () => {
      const { rerender } = render(
        <MemoryRouter>
          <CompatRouter>
            <ClusterList {...props} />
          </CompatRouter>
        </MemoryRouter>,
      );
      expect(screen.queryByTestId('cluster-list-filter-dropdown')).toBeInTheDocument();

      isRestrictedEnv.mockReturnValue(true);
      rerender(
        <MemoryRouter>
          <CompatRouter>
            <ClusterList {...props} />
          </CompatRouter>
        </MemoryRouter>,
      );
      expect(screen.queryByTestId('cluster-list-filter-dropdown')).not.toBeInTheDocument();

      expect(await screen.findByRole('button', { name: 'Create cluster' })).toBeInTheDocument();
    });
  });
});
