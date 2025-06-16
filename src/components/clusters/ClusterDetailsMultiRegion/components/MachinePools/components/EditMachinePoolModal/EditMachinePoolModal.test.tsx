import * as React from 'react';

import fixtures from '~/components/clusters/ClusterDetailsMultiRegion/__tests__/ClusterDetails.fixtures';
import { MAX_NODES_HCP } from '~/components/clusters/common/machinePools/constants';
import { GCP_SECURE_BOOT } from '~/queries/featureGates/featureConstants';
import { mockUseFeatureGate, render, screen, within } from '~/testUtils';
import { ClusterFromSubscription } from '~/types/types';

import EditMachinePoolModal from './EditMachinePoolModal';

const machinePoolsResponse = [
  {
    kind: 'NodePool',
    href: '/api/clusters_mgmt/v1/clusters/21gitfhopbgmmfhlu65v93n4g4n3djde/node_pools/workers',
    id: 'workers',
    replicas: 2,
    auto_repair: true,
    aws_node_pool: {
      instance_type: 'm5.xlarge',
      instance_profile: 'staging-21gitfhopbgmmfhlu65v93n4g4n3djde-jknhystj27-worker',
      tags: {
        'api.openshift.com/environment': 'staging',
      },
    },
    availability_zone: 'us-east-1b',
    subnet: 'subnet-049f90721559000de',
    status: {
      current_replicas: 2,
    },
    version: {
      kind: 'VersionLink',
      id: 'openshift-v4.12.5-candidate',
      href: '/api/clusters_mgmt/v1/versions/openshift-v4.12.5-candidate',
    },
  },
];

const gcpMachinePoolResponse = [
  {
    availability_zones: ['us-east1-b'],
    href: '/api/clusters_mgmt/v1/clusters/2j6c15idtf09ql5atgcbnop8tm1pr474/machine_pools/novm',
    id: 'novm',
    instance_type: 'n2-highmem-4',
    kind: 'MachinePool',
    replicas: 0,
  },
];

const machineTypesResponse = {
  types: {
    aws: [
      {
        id: 'm5.xlarge',
        cpu: {
          value: 4,
        },
        memory: {
          value: 4,
        },
      },
    ],
  },
};

const commonProps = {
  machinePoolsLoading: false,
  machinePoolsError: false,
  machineTypesLoading: false,
  machineTypesError: false,
  machineTypesErrorResponse: {},
  machinePoolsErrorResponse: {},
  machinePoolsResponse,
  machineTypesResponse,
};

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
          {...commonProps}
          machinePoolsError
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
          {...commonProps}
          machineTypesError
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
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
      expect(screen.getByTestId('submit-btn')).toBeDisabled();
      expect(screen.getByTestId('cancel-btn')).toBeEnabled();
    };

    it('Shows loading if machine pools are loading', async () => {
      render(
        <EditMachinePoolModal
          cluster={{} as ClusterFromSubscription}
          onClose={() => {}}
          {...commonProps}
          machinePoolsLoading
        />,
      );
      await check();
    });

    it('Shows loading if machine types are loading', async () => {
      render(
        <EditMachinePoolModal
          cluster={{} as ClusterFromSubscription}
          onClose={() => {}}
          {...commonProps}
          machineTypesLoading
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
          {...commonProps}
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
          {...commonProps}
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
          {...commonProps}
          isEdit
        />,
      );

      expect(await screen.findByRole('button', { name: 'Save' })).toBeInTheDocument();

      rerender(
        <EditMachinePoolModal
          cluster={{} as ClusterFromSubscription}
          onClose={() => {}}
          {...commonProps}
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
            {...commonProps}
            machinePoolsResponse={[
              {
                availability_zones: ['us-east-1a'],
                href: '/api/clusters_mgmt/v1/clusters/282fg0gt74jjb9558ge1poe8m4dlvb07/machine_pools/daznauro-mp',
                id: 'fooId',
                instance_type: 'm5.xlarge',
                kind: 'MachinePool',
                replicas: 21,
                root_volume: { aws: { size: 300 } },
              },
            ]}
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
            {...commonProps}
            machinePoolsResponse={[
              {
                availability_zones: ['us-east-1a', 'us-east-1b', 'us-east-1c'],
                href: '/api/clusters_mgmt/v1/clusters/282fg0gt74jjb9558ge1poe8m4dlvb07/machine_pools/daznauro-mp',
                id: 'fooId',
                instance_type: 'm5.xlarge',
                kind: 'MachinePool',
                replicas: 21,
                root_volume: { aws: { size: 300 } },
              },
            ]}
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
          {...commonProps}
          machinePoolsResponse={[
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
          ]}
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

  describe('GCP cluster machine pool', () => {
    mockUseFeatureGate([[GCP_SECURE_BOOT, true]]);
    const { OSDGCPClusterDetails } = fixtures;

    const GCPClusterWithSecureBoot = {
      ...OSDGCPClusterDetails.cluster,
      cloud_provider: {
        id: 'gcp',
      },
      gcp: {
        security: {
          secure_boot: true,
        },
      },
    };
    it('Add machine pool inherits secure boot in case of GCP cluster', async () => {
      render(
        <EditMachinePoolModal
          cluster={GCPClusterWithSecureBoot as unknown as ClusterFromSubscription}
          onClose={() => {}}
          {...commonProps}
          machinePoolsResponse={gcpMachinePoolResponse}
        />,
      );

      expect(
        await screen.findByLabelText('Enable Secure Boot support for Shielded VMs'),
      ).toBeInTheDocument();
      const check = await screen.findByRole('checkbox', {
        name: /Shielded VM Enable Secure Boot support for Shielded VMs/i,
      });

      expect(check).toBeChecked();
      expect(check).not.toBeDisabled();
    });

    it('Edit machine pool GCP Secure boot inherited by the cluster', async () => {
      render(
        <EditMachinePoolModal
          cluster={GCPClusterWithSecureBoot as unknown as ClusterFromSubscription}
          onClose={() => {}}
          {...commonProps}
          machinePoolId="novm"
          machinePoolsResponse={gcpMachinePoolResponse}
        />,
      );

      expect(
        await screen.findByLabelText('Enable Secure Boot support for Shielded VMs'),
      ).toBeInTheDocument();
      const check = await screen.findByRole('checkbox', {
        name: /Shielded VM Enable Secure Boot support for Shielded VMs/i,
      });

      expect(check).toBeChecked();
      expect(check).toBeDisabled();
    });
  });
});
