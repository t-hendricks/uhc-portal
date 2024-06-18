import React from 'react';
import { MemoryRouter } from 'react-router';
import { CompatRouter } from 'react-router-dom-v5-compat';

import * as usePreviousProps from '~/hooks/usePreviousProps';
import * as useFetchClusters from '~/queries/ClusterListQueries/useFetchClusters';

import { normalizedProducts } from '../../../common/subscriptionTypes';
import { viewConstants } from '../../../redux/constants';
import { mockRestrictedEnv, render, screen, within } from '../../../testUtils';
import fixtures, { funcs } from '../ClusterDetails/__tests__/ClusterDetails.fixtures';

import ClusterList from './ClusterList';

// Unsure why usePreviousProps isn't working - mocking for now
jest.spyOn(usePreviousProps, 'usePreviousProps').mockImplementation((value) => value);

// Mocking useFetchClusters due to the complexity of this custom hook
// the useFetchClusters hook has its own unit tests to ensure it returns the correct values
const mockedGetFetchedClusters = jest.spyOn(useFetchClusters, 'useFetchClusters');

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
