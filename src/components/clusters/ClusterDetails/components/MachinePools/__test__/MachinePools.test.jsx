import React from 'react';
import { screen, render, checkAccessibility } from '~/testUtils';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { baseRequestState } from '~/redux/reduxHelpers';
import MachinePools from '../MachinePools';
import clusterStates from '../../../../common/clusterStates';

const vpc = {
  aws_security_groups: [
    {
      name: '',
      id: 'sg-group-without-a-name',
    },
    {
      name: 'abc is my name',
      id: 'sg-abc',
    },
  ],
};

jest.mock(
  '~/components/clusters/CreateOSDPage/CreateOSDWizard/NetworkScreen/useAWSVPCFromCluster',
  () => ({
    useAWSVPCFromCluster: () => ({
      clusterVpc: vpc,
    }),
  }),
);
jest.mock('~/components/clusters/common/MachineConfiguration/MachineConfiguration', () => ({
  MachineConfiguration: () => <div data-testid="machine-configuration">MachineConfiguration</div>,
}));

const getMachinePools = jest.fn();
const deleteMachinePool = jest.fn();
const openModal = jest.fn();
const getOrganizationAndQuota = jest.fn();
const getMachineTypes = jest.fn();

const defaultMachinePool = {
  id: 'some-id',
  instance_type: 'm5.xlarge',
  availability_zones: ['us-east-1'],
  desired: 1,
};

const defaultCluster = {
  id: 'my-cluster-id',
  product: {
    id: normalizedProducts.ROSA,
  },
  machinePoolsActions: {
    create: true,
    update: true,
    delete: true,
    edit: true,
    list: true,
  },
  hypershift: {
    enabled: false,
  },
  ccs: {
    enabled: false,
  },
  cloud_provider: {
    id: 'aws',
  },
  state: clusterStates.READY,
};

const defaultProps = {
  cluster: defaultCluster,
  openModal,
  isDeleteMachinePoolModalOpen: false,
  isAddMachinePoolModalOpen: false,
  isEditTaintsModalOpen: false,
  isEditLabelsModalOpen: false,
  isClusterAutoscalingModalOpen: false,
  clusterAutoscalerResponse: {
    hasAutoscaler: false,
    getAutoscaler: { ...baseRequestState },
    editAction: { ...baseRequestState },
  },
  deleteMachinePoolResponse: { ...baseRequestState },
  machinePoolsList: { ...baseRequestState, data: [defaultMachinePool] },
  getMachinePools,
  deleteMachinePool,
  clearGetMachinePoolsResponse: jest.fn(),
  getClusterAutoscaler: jest.fn(),
  getOrganizationAndQuota,
  getMachineTypes,
  machineTypes: {},
  hasMachinePoolsQuota: true,
  canMachinePoolBeUpdated: jest.fn(() => false),
  clearDeleteMachinePoolResponse: jest.fn(),
  hasMachineConfiguration: false,
};

const simpleMachinePoolList = {
  data: [
    {
      availability_zones: ['us-east-1a'],
      href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/test-mp',
      id: 'test-mp',
      instance_type: 'm5.xlarge',
      kind: 'MachinePool',
      replicas: 1,
    },
  ],
};

describe('<MachinePools />', () => {
  describe('renders', () => {
    afterEach(() => {
      getMachinePools.mockClear();
    });
    it('should call getMachinePools on mount', () => {
      expect(getMachinePools).toBeCalledTimes(0);
      render(<MachinePools {...defaultProps} />);
      expect(getMachinePools).toBeCalled();
    });

    it('the machine pool ID', () => {
      render(<MachinePools {...defaultProps} />);
      expect(screen.getByText('some-id')).toBeInTheDocument();
    });

    it('the machine pool labels', () => {
      const newProps = {
        ...defaultProps,
        machinePoolsList: {
          ...baseRequestState,
          data: [{ ...defaultMachinePool, labels: { foo: 'bar', hello: 'world' } }],
        },
      };
      render(<MachinePools {...newProps} />);
      expect(screen.getByText('foo = bar')).toHaveClass('pf-v5-c-label__text');
      expect(screen.getByText('hello = world')).toHaveClass('pf-v5-c-label__text');
    });

    it('a truncated label that is longer than the cut length', () => {
      const newProps = {
        ...defaultProps,
        machinePoolsList: {
          ...baseRequestState,
          data: [
            {
              ...defaultMachinePool,
              labels: { label: 'this-label-goes-above-fifty-characters-and-it-will-be-truncated' },
            },
          ],
        },
      };
      render(<MachinePools {...newProps} />);
      expect(
        screen.getByText('label = this-lab... aracters-and-it-will-be-truncated'),
      ).toBeInTheDocument();
    });

    it('is accessible with additional machine pools, some with labels and/or taints', async () => {
      const newProps = {
        ...defaultProps,
        machinePoolsList: {
          data: [
            {
              availability_zones: ['us-east-1a'],
              href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/mp-with-labels-and-taints',
              id: 'mp-with-labels-and-taints',
              instance_type: 'm5.xlarge',
              kind: 'MachinePool',
              labels: { foo: 'bar' },
              replicas: 1,
              taints: [
                { key: 'foo1', value: 'bazz1', effect: 'NoSchedule' },
                { key: 'foo2', value: 'bazz2', effect: 'NoSchedule' },
              ],
            },
            {
              availability_zones: ['us-east-1a'],
              href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/mp-with-labels',
              id: 'mp-with-label',
              instance_type: 'm5.xlarge',
              kind: 'MachinePool',
              labels: { foo: 'bar' },
              replicas: 1,
            },
            {
              availability_zones: ['us-east-1a'],
              href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/mp-with-taints',
              id: 'mp-with-taints',
              instance_type: 'm5.xlarge',
              kind: 'MachinePool',
              replicas: 1,
              taints: [
                { key: 'foo1', value: 'bazz1', effect: 'NoSchedule' },
                { key: 'foo2', value: 'bazz2', effect: 'NoSchedule' },
              ],
            },
            {
              availability_zones: ['us-east-1a'],
              href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/mp-with-no-labels-no-taints',
              id: 'mp-with-no-labels-no-taints',
              instance_type: 'm5.xlarge',
              kind: 'MachinePool',
              replicas: 1,
            },
          ],
        },
      };
      const { container } = render(<MachinePools {...newProps} />);
      expect(screen.getByText('mp-with-labels-and-taints')).toBeInTheDocument();
      expect(screen.getByText('mp-with-label')).toBeInTheDocument();
      expect(screen.getByText('mp-with-taints')).toBeInTheDocument();
      expect(screen.getByText('mp-with-no-labels-no-taints')).toBeInTheDocument();
      await checkAccessibility(container);
    });

    it('with a machine pool with autoscaling enabled', () => {
      const data = [
        {
          autoscaling: { max_replicas: 2, min_replicas: 1 },
          availability_zones: ['us-east-1a'],
          href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/mp-autoscaling',
          id: 'mp-autoscaling',
          instance_type: 'm5.xlarge',
          kind: 'MachinePool',
          labels: { foo: 'bar' },
          taints: [
            { key: 'foo1', value: 'bazz1', effect: 'NoSchedule' },
            { key: 'foo2', value: 'bazz2', effect: 'NoSchedule' },
          ],
        },
      ];

      render(<MachinePools {...defaultProps} machinePoolsList={{ data }} />);
      expect(screen.getByText('mp-autoscaling')).toBeInTheDocument();
      expect(screen.getByText('Min nodes').closest('div')).toHaveTextContent('Min nodes 1');
      expect(screen.getByText('Max nodes').closest('div')).toHaveTextContent('Max nodes 2');
    });

    it('should render skeleton while fetching machine pools', async () => {
      const newProps = {
        ...defaultProps,
        machinePoolsList: { ...baseRequestState, pending: true, data: [] },
      };

      const { container } = render(<MachinePools {...newProps} />);
      expect(container.querySelectorAll('.pf-v5-c-skeleton').length).toBeGreaterThan(0);

      await checkAccessibility(container);
    });

    it('OpenShift version for machine pools is shown if hypershift', () => {
      const newProps = {
        ...defaultProps,
        cluster: {
          ...defaultCluster,
          hypershift: {
            enabled: true,
          },
        },
        machinePoolsList: {
          data: [
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
          ],
        },
      };
      render(<MachinePools {...newProps} />);

      expect(screen.getByText('4.12.5-candidate')).toBeInTheDocument();
    });

    it('should render error message', () => {
      const newProps = {
        ...defaultProps,
        deleteMachinePoolResponse: { ...baseRequestState, error: true },
      };
      render(<MachinePools {...newProps} />);
      expect(screen.getByTestId('alert-error')).toBeInTheDocument();
    });
  });

  describe('add machine pool', () => {
    it('should open modal', async () => {
      const { user } = render(<MachinePools {...defaultProps} />);
      expect(
        screen.queryByRole('dialog', { name: 'Add machine pool Add machine pool' }),
      ).not.toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: 'Add machine pool' }));
      // TODO: The name of the modal should be changed - this is an accessibility issues
      expect(
        screen.getByRole('dialog', { name: 'Add machine pool Add machine pool' }),
      ).toBeInTheDocument();
    });

    it('should not allow adding machine pools to users without enough quota', async () => {
      const newProps = { ...defaultProps, hasMachinePoolsQuota: false };
      render(<MachinePools {...newProps} />);

      // TODO: The button is not correctly disabled - this is an accessibility issue and should be fixed
      // expect(screen.getByRole('button', { name: 'Add machine pool' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Add machine pool' })).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });
  });

  describe('machine pool table actions', () => {
    it('Should enable all actions in kebab menu if hypershift', async () => {
      const newProps = {
        ...defaultProps,
        cluster: {
          ...defaultCluster,
          hypershift: {
            enabled: true,
          },
        },
        machineTypes: {
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
        },
        machinePoolsList: {
          data: [
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
            },
            {
              kind: 'NodePool',
              href: '/api/clusters_mgmt/v1/clusters/21gitfhopbgmmfhlu65v93n4g4n3djde/node_pools/workers',
              id: 'additional-np',
              replicas: 3,
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
                current_replicas: 3,
              },
            },
          ],
        },
      };

      const { user, container } = render(<MachinePools {...newProps} />);
      expect(screen.getAllByRole('button', { name: 'Kebab toggle' })).toHaveLength(2);

      screen.getAllByRole('button', { name: 'Kebab toggle' }).forEach(async (button) => {
        await user.click(button);
        const menuItems = container.querySelectorAll(
          '.pf-v5-c-dropdown__menu .pf-v5-c-dropdown__menu-item',
        );
        menuItems.forEach((item) => {
          expect(item).not.toHaveAttribute('aria-disabled');
        });
      });
    });

    it('Should disable delete action in kebab menu if there is only one node pool and hypershift is true', async () => {
      const newProps = {
        ...defaultProps,
        cluster: {
          ...defaultCluster,
          hypershift: {
            enabled: true,
          },
        },
        machinePoolsList: {
          data: [
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
            },
          ],
        },
      };

      const { user } = render(<MachinePools {...newProps} />);
      await user.click(screen.getByRole('button', { name: 'Kebab toggle' }));
      // TODO, the menu item is not properly disabled - this is is an accessibility issue
      // expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeDisabled();
      expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });

    it('Should enable all actions in kebab menu if hypershift is false', () => {
      const newProps = {
        ...defaultProps,
        cluster: {
          ...defaultCluster,
          ccs: { enabled: true },
        },
        machineTypes: {
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
        },
        machinePoolsList: {
          data: [
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
            },
            {
              kind: 'NodePool',
              href: '/api/clusters_mgmt/v1/clusters/21gitfhopbgmmfhlu65v93n4g4n3djde/node_pools/workers',
              id: 'workers1',
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
            },
          ],
        },
      };

      const { user, container } = render(<MachinePools {...newProps} />);
      expect(screen.getAllByRole('button', { name: 'Kebab toggle' })).toHaveLength(2);

      screen.getAllByRole('button', { name: 'Kebab toggle' }).forEach(async (button) => {
        await user.click(button);
        const menuItems = container.querySelectorAll(
          '.pf-v5-c-dropdown__menu .pf-v5-c-dropdown__menu-item',
        );
        menuItems.forEach((item) => {
          expect(item).not.toHaveAttribute('aria-disabled');
        });
      });
    });

    it('displays option to update machine pool if machine pool can be updated ', async () => {
      const props = {
        ...defaultProps,
        cluster: {
          ...defaultCluster,
          hypershift: {
            enabled: true,
          },
        },
        machinePoolsList: {
          data: [
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
          ],
        },
        canMachinePoolBeUpdated: jest.fn(() => true),
      };

      const { user } = render(<MachinePools {...props} />);

      await user.click(screen.getByRole('button', { name: 'Kebab toggle' }));
      expect(screen.getByRole('menuitem', { name: 'Update version' })).toBeInTheDocument();
    });

    it('hides option to update machine pool if machine pool cannot be updated', async () => {
      const props = {
        ...defaultProps,
        cluster: {
          ...defaultCluster,
          hypershift: {
            enabled: true,
          },
        },
        machinePoolsList: {
          data: [
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
          ],
        },
        canMachinePoolBeUpdated: jest.fn(() => false),
      };

      const { user } = render(<MachinePools {...props} />);

      await user.click(screen.getByRole('button', { name: 'Kebab toggle' }));
      expect(screen.getAllByRole('menuitem').length).not.toEqual(0);
      expect(screen.queryByRole('menuitem', { name: 'Update version' })).not.toBeInTheDocument();
    });

    it('Should disable actions on machine pools if user does not have permissions', () => {
      const props = {
        ...defaultProps,
        cluster: {
          ...defaultProps.cluster,
          hypershift: {
            enabled: true,
          },
          machinePoolsActions: {
            create: false,
            update: false,
            delete: false,
            edit: false,
            list: true,
          },
        },
        machinePoolsList: {
          data: [
            {
              availability_zones: ['us-east-1a'],
              href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/test-mp',
              id: 'test-mp',
              instance_type: 'm5.xlarge',
              kind: 'MachinePool',
              replicas: 1,
            },
          ],
        },
      };
      const { container } = render(<MachinePools {...props} />);
      // add machine pool button is disabled
      expect(container.querySelector('#add-machine-pool')).toHaveAttribute('aria-disabled', 'true');
      // table actions are disabled
      expect(screen.queryByRole('button', { name: 'Kebab toggle' })).toBeDisabled();
    });

    it('Should disable delete action if user does not have permissions', async () => {
      const props = {
        ...defaultProps,
        cluster: {
          ...defaultProps.cluster,
          hypershift: {
            enabled: true,
          },
          machinePoolsActions: {
            create: false,
            update: true,
            delete: false,
            edit: true,
            list: true,
          },
        },
        machinePoolsList: {
          data: [
            {
              availability_zones: ['us-east-1a'],
              href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/test-mp',
              id: 'test-mp',
              instance_type: 'm5.xlarge',
              kind: 'MachinePool',
              replicas: 1,
            },
          ],
        },
      };
      const { user } = render(<MachinePools {...props} />);
      await user.click(screen.getByRole('button', { name: 'Kebab toggle' }));
      expect(screen.queryByRole('menuitem', { name: 'Delete' })).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });

    it('Should allow actions on machine pools if user has permissions', () => {
      const props = {
        ...defaultProps,
        cluster: {
          ...defaultCluster,
          hypershift: {
            enabled: true,
          },
        },
        machinePoolsList: {
          data: [
            {
              availability_zones: ['us-east-1a'],
              href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/test-mp',
              id: 'test-mp',
              instance_type: 'm5.xlarge',
              kind: 'MachinePool',
              replicas: 1,
            },
          ],
        },
      };
      const { container } = render(<MachinePools {...props} />);
      // add machine pool button is enabled
      expect(container.querySelector('#add-machine-pool')).toHaveAttribute(
        'aria-disabled',
        'false',
      );
      // table actions are enabled
      expect(screen.getByRole('button', { name: 'Kebab toggle' })).toBeEnabled();
    });
  });

  it('Should render successfully when machinePoolsActions is unset (rendering from cluster list data)', () => {
    const props = {
      ...defaultProps,
      cluster: {
        ...defaultCluster,
        hypershift: {
          enabled: true,
        },
        machinePoolsActions: undefined,
      },

      machinePoolsList: simpleMachinePoolList,
    };

    const { container } = render(<MachinePools {...props} />);
    // add machine pool button is disabled
    expect(container.querySelector('#add-machine-pool')).toHaveAttribute('aria-disabled', 'true');
    // the table does not become rendered because "list" permission is missing
    expect(screen.queryByRole('grid', { name: 'Machine pools' })).not.toBeInTheDocument();
  });

  describe('Machine configuration', () => {
    const machineConfigLabel = 'Edit machine configuration';

    const expectActionButton = ({ toBePresent, toBeEnabled = true }) => {
      if (toBePresent) {
        expect(screen.getByRole('button', { name: machineConfigLabel })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: machineConfigLabel })).toHaveAttribute(
          'aria-disabled',
          `${String(!toBeEnabled)}`,
        );
      } else {
        expect(screen.queryByRole('button', { name: machineConfigLabel })).not.toBeInTheDocument();
      }
    };

    it('is not present if feature flag is disabled', () => {
      render(<MachinePools {...defaultProps} />);

      expectActionButton({ toBePresent: false });
    });

    it('is present if feature flag is enabled and cluster is ROSA', () => {
      const props = { ...defaultProps, hasMachineConfiguration: true };
      render(<MachinePools {...props} />);

      expectActionButton({ toBePresent: true });
    });

    it('is present if feature flag is enabled and cluster is OSD with CCS on AWS', () => {
      const props = {
        ...defaultProps,
        hasMachineConfiguration: true,
        cluster: {
          ...defaultCluster,
          product: {
            id: normalizedProducts.OSD,
          },
          ccs: {
            enabled: true,
          },
          subscription: {
            cloud_provider_id: 'aws',
          },
        },
      };
      render(<MachinePools {...props} />);

      expectActionButton({ toBePresent: true });
    });

    it('is present but disabled if the cluster is not in "ready" state', () => {
      const props = {
        ...defaultProps,
        hasMachineConfiguration: true,
        cluster: {
          ...defaultCluster,
          state: clusterStates.HIBERNATING,
        },
      };
      render(<MachinePools {...props} />);

      expectActionButton({ toBePresent: true, toBeEnabled: false });
    });

    it('is absent if feature flag is enabled and cluster is OSD with CCS on GCP', () => {
      const props = {
        ...defaultProps,
        hasMachineConfiguration: true,
        cluster: {
          ...defaultCluster,
          product: {
            id: normalizedProducts.OSD,
          },
          ccs: {
            enabled: true,
          },
          subscription: {
            cloud_provider_id: 'gcp',
          },
        },
      };
      render(<MachinePools {...props} />);

      expectActionButton({ toBePresent: false });
    });

    it('is absent if feature flag is enabled and cluster is OSD without CCS', () => {
      const props = {
        ...defaultProps,
        hasMachineConfiguration: true,
        cluster: {
          ...defaultCluster,
          product: {
            id: normalizedProducts.OSD,
          },
          ccs: {
            enabled: false,
          },
          subscription: {
            cloud_provider_id: 'aws',
          },
        },
      };
      render(<MachinePools {...props} />);

      expectActionButton({ toBePresent: false });
    });

    it('is absent if feature flag is enabled and cluster is Hypershift', () => {
      const props = {
        ...defaultProps,
        hasMachineConfiguration: true,
        cluster: {
          ...defaultCluster,
          hypershift: {
            enabled: true,
          },
        },
      };
      render(<MachinePools {...props} />);

      expectActionButton({ toBePresent: false });
    });

    it('shows the machine configuration when clicking on "Edit machine configuration"', async () => {
      const props = { ...defaultProps, hasMachineConfiguration: true };
      const machineConfigurationTestID = 'machine-configuration';
      const { user } = render(<MachinePools {...props} />);

      expect(screen.getByRole('button', { name: machineConfigLabel })).toBeInTheDocument();
      expect(screen.queryByTestId(machineConfigurationTestID)).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: machineConfigLabel }));

      expect(screen.getByTestId(machineConfigurationTestID)).toBeInTheDocument();
    });
  });
});
