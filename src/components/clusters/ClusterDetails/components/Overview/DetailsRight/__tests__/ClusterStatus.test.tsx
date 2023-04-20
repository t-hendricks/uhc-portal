import React from 'react';
import { render, screen } from '@testUtils';
import { ClusterStatus } from '../ClusterStatus';

const cluster = {
  name: 'Some Cluster',
  id: 'cluster-id',
  state: { state: 'ready', description: 'Ready' },
};
const machinePools = [
  {
    status: { current_replicas: 2 },
    replicas: 2,
  },
  {
    status: { current_replicas: 3 },
    replicas: 4,
  },
];

const machinePoolsAutoScale = [
  {
    autoscaling: { min_replica: 2, max_replica: 3 },
    status: { current_replicas: 2 },
  },
  {
    autoscaling: { min_replica: 2, max_replica: 3 },
    status: { current_replicas: 3 },
  },
  {
    autoscaling: { min_replica: 2, max_replica: 3 },
    status: { current_replicas: 1 },
  },
  {
    autoscaling: { min_replica: 2, max_replica: 3 },
    status: { current_replicas: 4 },
  },
];

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
          machinePools={machinePools}
        />,
      );

      expect(screen.getByText('Control plane:')).toBeVisible();
      expect(screen.getByText('Machine pools:')).toBeVisible();
    });

    it('shows correct number of machine pools in "ready like" status', () => {
      render(
        <ClusterStatus
          cluster={{ ...cluster, hypershift: { enabled: true } }}
          limitedSupport={false}
          machinePools={machinePools}
        />,
      );

      expect(screen.getByText('Pending 1 / 2')).toBeVisible();
    });

    it('shows correct number of ready machine pools when one machine pool has 0 replicas', () => {
      render(
        <ClusterStatus
          cluster={{ ...cluster, hypershift: { enabled: true } }}
          limitedSupport={false}
          machinePools={[...machinePools, { status: { current_replicas: 0 }, replicas: 0 }]}
        />,
      );

      expect(screen.getByText('Pending 2 / 3')).toBeVisible();
    });

    it('shows correct number of autoscaling machine pools in "ready like" status ', () => {
      render(
        <ClusterStatus
          cluster={{ ...cluster, hypershift: { enabled: true } }}
          limitedSupport={false}
          machinePools={machinePoolsAutoScale}
        />,
      );

      expect(screen.getByText('Pending 2 / 4')).toBeVisible();
    });
  });
});
