import React from 'react';
import { screen } from '@testing-library/dom';
import { MemoryRouter } from 'react-router';

import ClusterList from './ClusterList';
import fixtures from '../ClusterDetails/__test__/ClusterDetails.fixtures';
import { normalizedProducts } from '../../../common/subscriptionTypes';
import { viewConstants } from '../../../redux/constants';
import { mockRestrictedEnv, render } from '../../../testUtils';

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
        sorting: {
          sortField: '',
        },
      },
      clusters: [fixtures.clusterDetails.cluster],
      meta: {},
      queryParams: {},
      closeModal: () => {},
      clearClusterDetails: () => {},
      clearGlobalError: () => {},
      features: {},
      valid: true,
    };
    afterEach(() => {
      isRestrictedEnv.mockReturnValue(false);
    });

    it('should call onListFlagsSet with ROSA filter', () => {
      isRestrictedEnv.mockReturnValue(true);
      render(<ClusterList {...props} />);
      expect(onListFlagsSet).toHaveBeenCalled();
      const args = onListFlagsSet.mock.calls[0];
      expect(args[0]).toBe('subscriptionFilter');
      expect(args[1]).toStrictEqual({ plan_id: [normalizedProducts.ROSA] });
      expect(args[2]).toBe(viewConstants.CLUSTERS_VIEW);
    });

    it('does not render filtering', () => {
      const { rerender } = render(
        <MemoryRouter>
          <ClusterList {...props} />
        </MemoryRouter>,
      );
      expect(screen.queryByTestId('cluster-list-filter-dropdown')).toBeInTheDocument();

      isRestrictedEnv.mockReturnValue(true);
      rerender(
        <MemoryRouter>
          <ClusterList {...props} />
        </MemoryRouter>,
      );
      expect(screen.queryByTestId('cluster-list-filter-dropdown')).not.toBeInTheDocument();
    });
  });
});
