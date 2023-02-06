import React from 'react';
import { render, screen, within } from '@testUtils';
import { ClusterStatus } from '../ClusterStatus';

const cluster = {
  name: 'Some Cluster',
  id: 'cluster-id',
  state: { state: 'ready', description: 'Ready' },
};

describe('ClusterStatus', () => {
  describe('when hypershift is not enabled', () => {
    it('only the cluster-wide status is shown', () => {
      render(<ClusterStatus cluster={cluster} limitedSupport={false} />);

      expect(screen.getByText('Ready')).toBeVisible();
      expect(screen.queryByText('Control plane:')).toBeNull();
      expect(screen.queryByText('Machine pools:')).toBeNull();
    });
  });

  describe('when hypershift is enabled', () => {
    it('control plane and machine pools statuses are shown', () => {
      render(
        <ClusterStatus
          cluster={{ ...cluster, hypershift: { enabled: true } }}
          limitedSupport={false}
        />,
      );

      expect(screen.getByText('Control plane:')).toBeVisible();
      expect(screen.getByText('Machine pools:')).toBeVisible();
    });

    it('shows "Ready" machine pools status when compute counts are equal', () => {
      render(
        <ClusterStatus
          cluster={{
            ...cluster,
            nodes: { compute: 1 },
            status: { current_compute: 1 },
            hypershift: { enabled: true },
          }}
          limitedSupport={false}
        />,
      );

      expect(within(screen.getByTestId('machine-pools-status')).getByText('Ready')).toBeVisible();
    });

    it('shows "Installing" machine pools status when compute counts are not equal', () => {
      render(
        <ClusterStatus
          cluster={{
            ...cluster,
            nodes: { compute: 1 },
            status: { current_compute: 0 },
            hypershift: { enabled: true },
          }}
          limitedSupport={false}
        />,
      );

      expect(
        within(screen.getByTestId('machine-pools-status')).getByText('Installing'),
      ).toBeVisible();
    });

    it('shows "Uninstalling" machine pools status when cluster-wide compute count is greater than the node compute count', () => {
      render(
        <ClusterStatus
          cluster={{
            ...cluster,
            nodes: { compute: 0 },
            status: { current_compute: 1 },
            hypershift: { enabled: true },
          }}
          limitedSupport={false}
        />,
      );

      expect(
        within(screen.getByTestId('machine-pools-status')).getByText('Uninstalling'),
      ).toBeVisible();
    });
  });
});
