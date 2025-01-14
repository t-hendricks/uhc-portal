import * as React from 'react';

import { MAX_NODES_HCP } from '~/components/clusters/common/machinePools/constants';
import { render, screen, within } from '~/testUtils';
import { ClusterFromSubscription } from '~/types/types';

import { EditMachinePoolModal } from './EditMachinePoolModal';

const testCluster = {
  name: 'test-cluster-name',
  domain_prefix: 'domainPre1',
  subscription: {
    display_name: 'test-cluster-display-name',
  },
};

describe('<EditMachinePoolModal />', () => {
  describe('error state', () => {
    it('Shows alert if machine pools failed to load', async () => {
      render(
        <EditMachinePoolModal
          cluster={{} as ClusterFromSubscription}
          onClose={() => {}}
          machinePoolsResponse={{
            error: true,
            fulfilled: false,
            pending: false,
            errorCode: 400,
            errorMessage: 'foo err',
          }}
          machineTypesResponse={{
            error: false,
            pending: false,
            fulfilled: true,
            types: {},
            typesByID: {},
          }}
          isEdit={false}
        />,
      );

      expect(
        within(await screen.findByRole('alert')).getByText(/Failed to fetch resources/),
      ).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Add machine pool' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
    });

    it('Shows alert if machine types failed to load', async () => {
      render(
        <EditMachinePoolModal
          cluster={{} as ClusterFromSubscription}
          onClose={() => {}}
          machinePoolsResponse={{
            error: true,
            fulfilled: false,
            pending: false,
            errorCode: 400,
            errorMessage: 'foo err',
          }}
          machineTypesResponse={{
            error: false,
            pending: false,
            fulfilled: true,
            types: {},
            typesByID: {},
          }}
          isEdit={false}
        />,
      );

      expect(
        within(await screen.findByRole('alert')).getByText(/Failed to fetch resources/),
      ).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Add machine pool' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
    });
  });

  describe('loading state', () => {
    const check = async () => {
      expect(await screen.findByText('Loading...')).toBeInTheDocument();
      expect(screen.getByTestId('submit-btn')).toBeDisabled();
      expect(screen.getByTestId('cancel-btn')).toBeEnabled();
    };

    it('Shows loading if machine pools are loading', async () => {
      render(
        <EditMachinePoolModal
          cluster={{} as ClusterFromSubscription}
          onClose={() => {}}
          machinePoolsResponse={{
            error: false,
            fulfilled: false,
            pending: false,
          }}
          machineTypesResponse={{
            error: false,
            pending: false,
            fulfilled: true,
            types: {},
            typesByID: {},
          }}
        />,
      );
      await check();
    });

    it('Shows loading if machine types are loading', async () => {
      render(
        <EditMachinePoolModal
          cluster={{} as ClusterFromSubscription}
          onClose={() => {}}
          machinePoolsResponse={{
            error: false,
            fulfilled: true,
            pending: false,
            data: [],
          }}
          machineTypesResponse={{
            error: false,
            pending: false,
            fulfilled: false,
          }}
        />,
      );
      await check();
    });
  });

  describe('add machine pool', () => {
    it('Submit button shows `Add machine pool`', async () => {
      render(
        <EditMachinePoolModal
          cluster={{} as ClusterFromSubscription}
          onClose={() => {}}
          machinePoolsResponse={{
            error: false,
            fulfilled: true,
            pending: false,
            data: [],
          }}
          machineTypesResponse={{
            error: false,
            pending: false,
            fulfilled: true,
            types: {},
            typesByID: {},
          }}
          isEdit={false}
        />,
      );

      expect(await screen.findByRole('button', { name: 'Add machine pool' })).toBeInTheDocument();
    });
  });

  describe('edit machine pool', () => {
    it('shows subscription display name when displayClusterName is true', async () => {
      render(
        <EditMachinePoolModal
          cluster={testCluster as unknown as ClusterFromSubscription}
          onClose={() => {}}
          shouldDisplayClusterName
          machinePoolsResponse={{
            error: false,
            fulfilled: true,
            pending: false,
            data: [],
          }}
          machineTypesResponse={{
            error: false,
            pending: false,
            fulfilled: true,
            types: {},
            typesByID: {},
          }}
          isEdit
        />,
      );

      expect(screen.queryByText('test-cluster-name')).not.toBeInTheDocument();
      expect(await screen.findByText('test-cluster-display-name')).toBeInTheDocument();
    });

    it('Submit button shows `Save`', async () => {
      const { rerender } = render(
        <EditMachinePoolModal
          cluster={{} as ClusterFromSubscription}
          onClose={() => {}}
          machinePoolsResponse={{
            error: false,
            fulfilled: true,
            pending: false,
            data: [],
          }}
          machineTypesResponse={{
            error: false,
            pending: false,
            fulfilled: true,
            types: {},
            typesByID: {},
          }}
          isEdit
        />,
      );

      expect(await screen.findByRole('button', { name: 'Save' })).toBeInTheDocument();

      rerender(
        <EditMachinePoolModal
          cluster={{} as ClusterFromSubscription}
          onClose={() => {}}
          machinePoolsResponse={{
            error: false,
            fulfilled: true,
            pending: false,
            data: [],
          }}
          machineTypesResponse={{
            error: false,
            pending: false,
            fulfilled: true,
            types: {},
            typesByID: {},
          }}
          machinePoolId="foo"
        />,
      );

      expect(await screen.findByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    describe('Singlezone and multizone machine pool in multizone cluster', () => {
      it('Loaded state with single zone machinepool', async () => {
        render(
          <EditMachinePoolModal
            cluster={{ multi_az: true } as ClusterFromSubscription}
            onClose={() => {}}
            machinePoolsResponse={{
              error: false,
              fulfilled: true,
              pending: false,
              data: [
                {
                  availability_zones: ['us-east-1a'],
                  href: '/api/clusters_mgmt/v1/clusters/282fg0gt74jjb9558ge1poe8m4dlvb07/machine_pools/daznauro-mp',
                  id: 'fooId',
                  instance_type: 'm5.xlarge',
                  kind: 'MachinePool',
                  replicas: 21,
                  root_volume: { aws: { size: 300 } },
                },
              ],
            }}
            machineTypesResponse={{
              error: false,
              pending: false,
              fulfilled: true,
              types: {},
              typesByID: {},
            }}
            machinePoolId="fooId"
          />,
        );

        expect(await screen.findByText('Compute node count')).toBeInTheDocument();
        expect(await screen.findByText('21')).toBeInTheDocument();
      });

      it('Loaded state with multi zone machinepool', async () => {
        render(
          <EditMachinePoolModal
            cluster={{ multi_az: true } as ClusterFromSubscription}
            onClose={() => {}}
            machinePoolsResponse={{
              error: false,
              fulfilled: true,
              pending: false,
              data: [
                {
                  availability_zones: ['us-east-1a', 'us-east-1b', 'us-east-1c'],
                  href: '/api/clusters_mgmt/v1/clusters/282fg0gt74jjb9558ge1poe8m4dlvb07/machine_pools/daznauro-mp',
                  id: 'fooId',
                  instance_type: 'm5.xlarge',
                  kind: 'MachinePool',
                  replicas: 21,
                  root_volume: { aws: { size: 300 } },
                },
              ],
            }}
            machineTypesResponse={{
              error: false,
              pending: false,
              fulfilled: true,
              types: {},
              typesByID: {},
            }}
            machinePoolId="fooId"
          />,
        );

        expect(await screen.findByText('Compute node count (per zone)')).toBeInTheDocument();
        expect(await screen.findByText('7')).toBeInTheDocument();
      });
    });
  });

  describe('ROSA Hypershift cluster machine pool', () => {
    it('Disabled Add Machine Pool button on max replicas', async () => {
      // Render
      const { user } = render(
        <EditMachinePoolModal
          cluster={
            {
              multi_az: false,
              hypershift: { enabled: true },
              product: { id: 'ROSA' },
            } as ClusterFromSubscription
          }
          onClose={() => {}}
          isHypershift
          machinePoolsResponse={{
            error: false,
            fulfilled: true,
            pending: false,
            data: [
              {
                availability_zones: ['us-east-1a'],
                href: '/api/clusters_mgmt/v1/clusters/282fg0gt74jjb9558ge1poe8m4dlvb07/machine_pools/daznauro-mp',
                id: 'fooId',
                instance_type: 'm5.xlarge',
                kind: 'MachinePool',
                replicas: MAX_NODES_HCP,
                root_volume: { aws: { size: 300 } },
              },
              {
                availability_zones: ['us-east-1a'],
                href: '/api/clusters_mgmt/v1/clusters/282fg0gt74jjb9558ge1poe8m4dlvb07/machine_pools/daznauro-mp',
                id: 'fooId2',
                instance_type: 'm5.xlarge',
                kind: 'MachinePool',
                autoscaling: {
                  min_replicas: 1,
                  max_replicas: 2,
                },
                root_volume: { aws: { size: 300 } },
              },
            ],
          }}
          machineTypesResponse={{
            error: false,
            pending: false,
            fulfilled: true,
            types: {},
            typesByID: {},
          }}
          isEdit={false}
        />,
      );

      // Act
      const inputField = await screen.findByRole('textbox');
      await user.type(inputField, 'test');

      const autoScalingCheckbox = await screen.findByRole('checkbox', {
        name: 'Enable autoscaling',
      });
      const autoRepairCheckbox = await screen.findByRole('checkbox', {
        name: 'Enable AutoRepair',
      });

      await user.click(autoScalingCheckbox);

      // Assert
      expect(autoRepairCheckbox).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: 'Plus' })[1]).toBeDisabled();
      expect(await screen.findByTestId('submit-btn')).toBeDisabled();
    });
  });
});
