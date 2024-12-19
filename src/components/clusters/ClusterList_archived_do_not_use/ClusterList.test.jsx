import React from 'react';

import * as usePreviousProps from '~/hooks/usePreviousProps';

import { normalizedProducts } from '../../../common/subscriptionTypes';
import { viewConstants } from '../../../redux/constants';
import { mockRestrictedEnv, render, screen } from '../../../testUtils';
import fixtures, { funcs } from '../ClusterDetailsMultiRegion/__tests__/ClusterDetails.fixtures';

import ClusterList from './ClusterList';

// Unsure why usePreviousProps isn't working - mocking for now
jest.spyOn(usePreviousProps, 'usePreviousProps').mockImplementation((value) => value);

describe('<ClusterList />', () => {
  describe('in restricted env', () => {
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
      pendingOrganizationAccessRequests: {},
      organizationId: 'whateverTheOrganizationId',
      isOrganizationAccessProtectionEnabled: false,
      ...funcs(),
      clearClusterDetails: jest.fn(),
      setClusterDetails: jest.fn(),
      setListFlag: jest.fn(),
      setSorting: jest.fn(),
      getMachineTypes: jest.fn(),
      resetOrganizationAccessProtection: jest.fn(),
      getOrganizationAccessProtection: jest.fn(),
    };
    afterEach(() => {
      isRestrictedEnv.mockReturnValue(false);
    });

    it('should call onListFlagsSet with ROSA filter', async () => {
      isRestrictedEnv.mockReturnValue(true);
      render(<ClusterList {...props} />);
      expect(onListFlagsSet).toHaveBeenCalled();
      const args = onListFlagsSet.mock.calls[0];
      expect(args[0]).toBe('subscriptionFilter');
      expect(args[1]).toStrictEqual({ plan_id: [normalizedProducts.ROSA] });
      expect(args[2]).toBe(viewConstants.CLUSTERS_VIEW);

      expect(await screen.findByRole('button', { name: 'Create cluster' })).toBeInTheDocument();
    });

    it('does not render filtering', async () => {
      const { rerender } = render(<ClusterList {...props} />);
      expect(screen.queryByTestId('cluster-list-filter-dropdown')).toBeInTheDocument();

      isRestrictedEnv.mockReturnValue(true);
      rerender(<ClusterList {...props} />);
      expect(screen.queryByTestId('cluster-list-filter-dropdown')).not.toBeInTheDocument();

      expect(await screen.findByRole('button', { name: 'Create cluster' })).toBeInTheDocument();
    });
  });
});
