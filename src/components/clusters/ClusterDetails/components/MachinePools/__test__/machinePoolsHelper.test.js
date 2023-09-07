import { normalizedProducts } from '../../../../../../common/subscriptionTypes';
import {
  actionResolver,
  parseLabels,
  parseTags,
  normalizeNodePool,
  normalizeMachinePool,
} from '../machinePoolsHelper';

describe('machine pools action resolver', () => {
  const onClickDelete = jest.fn();
  const onClickScale = jest.fn();
  const onClickEditTaints = jest.fn();
  const onClickEditLabels = jest.fn();

  const scaleAction = {
    title: 'Scale',
    onClick: onClickScale,
    className: 'hand-pointer',
  };

  const editTaintsAction = {
    title: 'Edit taints',
    onClick: onClickEditTaints,
    className: 'hand-pointer',
    isAriaDisabled: false,
  };

  const editLabelsAction = {
    title: 'Edit labels',
    onClick: onClickEditLabels,
    className: 'hand-pointer',
  };

  const deleteAction = {
    title: 'Delete',
    onClick: onClickDelete,
    className: 'hand-pointer',
    isAriaDisabled: false,
  };

  it('should not have actions for an expandable row', () => {
    const expandableRowData = {
      parent: 1,
      cells: [{ title: 'test' }],
      key: 'Default-child',
    };

    expect(
      actionResolver({
        rowData: expandableRowData,
        onClickDelete,
        onClickScale,
        onClickEditTaints,
        onClickEditLabels,
        machinePools: [],
      }),
    ).toEqual(expect.arrayContaining([]));
  });

  it('should have scale, edit taints, edit labels and delete actions', () => {
    const machinePoolRowData = {
      cells: ['test-mp', 'm5.xlarge', 'us-east-1a', '4'],
      machinePool: { id: 'test-mp' },
      key: 'test-mp',
    };
    const expected = [scaleAction, editLabelsAction, editTaintsAction, deleteAction];

    expect(
      actionResolver({
        rowData: machinePoolRowData,
        onClickDelete,
        onClickScale,
        onClickEditTaints,
        onClickEditLabels,
        canDelete: true,
        machinePools: [
          {
            id: 'test-mp',
          },
          {
            id: 'foo-mp',
            instance_type: 'm5.xlarge',
            replicas: 5,
          },
        ],
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
        cluster: {
          ccs: {
            enabled: true,
          },
          cloud_provider: {
            id: 'aws',
          },
        },
      }),
    ).toEqual(expect.arrayContaining(expected));
  });

  it('disables Taints and Delete for enforced default pool', () => {
    const defaultMachinePoolRowData = {
      cells: ['worker', 'm5.xlarge', 'us-east-1a', '4'],
      machinePool: { id: 'worker' },
      key: 'worker',
    };
    const editTaintsAction = {
      title: 'Edit taints',
      onClick: onClickEditTaints,
      className: 'hand-pointer',
      isAriaDisabled: true,
      tooltip: 'Default machine pool cannot have taints',
    };
    const deleteAction = {
      title: 'Delete',
      onClick: onClickDelete,
      className: 'hand-pointer',
      isAriaDisabled: true,
      tooltip: 'Default machine pool cannot be deleted',
    };
    const expected = [scaleAction, editLabelsAction, editTaintsAction, deleteAction];

    expect(
      actionResolver({
        rowData: defaultMachinePoolRowData,
        onClickDelete,
        onClickScale,
        onClickEditTaints,
        onClickEditLabels,
        canDelete: true,
        machinePools: [
          {
            id: 'foo-mp',
          },
          {
            id: 'bar-mp',
          },
        ],
        cluster: {
          product: {
            id: normalizedProducts.ROSA,
          },
          ccs: {
            enabled: true,
          },
        },
        machineTypes: {},
      }),
    ).toEqual(expect.arrayContaining(expected));
  });

  it('disables Delete and taints for non-ccs worker Machine Pool', () => {
    const defaultMachinePoolRowData = {
      cells: ['worker', 'm5.xlarge', 'us-east-1a', '4'],
      machinePool: { id: 'worker' },
      key: 'worker',
    };
    const deleteAction = {
      title: 'Delete',
      onClick: onClickDelete,
      className: 'hand-pointer',
      isAriaDisabled: true,
      tooltip: 'Default machine pool cannot be deleted',
    };

    const editTaintsAction = {
      title: 'Edit taints',
      onClick: onClickEditTaints,
      className: 'hand-pointer',
      isAriaDisabled: true,
      tooltip: 'Default machine pool cannot have taints',
    };
    const expected = [scaleAction, editLabelsAction, editTaintsAction, deleteAction];

    const actions = actionResolver({
      rowData: defaultMachinePoolRowData,
      onClickDelete,
      onClickScale,
      onClickEditTaints,
      onClickEditLabels,
      canDelete: true,
      machinePools: [
        {
          id: 'worker',
        },
        {
          id: 'foo',
        },
      ],
      cluster: {
        product: {
          id: normalizedProducts.ROSA,
        },
        ccs: {
          enabled: false,
        },
      },
      machineTypes: {},
    });

    expect(actions).toEqual(expect.arrayContaining(expected));
  });
});

describe('parseLabels', () => {
  it('should convert to array properly', () => {
    const labels = { foo: 'bar', hello: 'world' };
    const expected = ['foo=bar', 'hello=world'];
    expect(parseLabels(labels)).toEqual(expected);
  });

  it('should return an empty array when there are no labels', () => {
    expect(parseLabels({})).toEqual([]);
  });
});

describe('parseTags', () => {
  it('should convert to object properly', () => {
    const tags = ['foo=bar', 'hello=world'];
    const expected = { foo: 'bar', hello: 'world' };
    expect(parseTags(tags)).toEqual(expected);
  });

  it('should omit invalid tags', () => {
    const tags = ['foo=bar', 'hello_=world'];
    const expected = { foo: 'bar' };
    expect(parseTags(tags)).toEqual(expected);
  });

  it('should return an empty object when there are no tags', () => {
    expect(parseTags([])).toEqual({});
  });
});

describe('normalizeNodePool', () => {
  const nodePoolBase = {
    kind: 'NodePool',
    href: '/api/clusters_mgmt/v1/clusters/21gitfhopbgmmfhlu65v93n4g4n3djde/node_pools/workers',
    id: 'workers',
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
  };
  it('Changes singular (min|max)_replica to plural (min|max)_replicas', () => {
    const nodePoolwithAutoScaling = {
      ...nodePoolBase,
      autoscaling: {
        min_replica: 2,
        max_replica: 5,
      },
    };

    const normalizedNodePool = {
      ...nodePoolBase,
      autoscaling: {
        min_replicas: 2,
        max_replicas: 5,
      },
    };
    expect(normalizeNodePool(nodePoolwithAutoScaling)).toEqual(normalizedNodePool);
  });

  it('should keep same structue', () => {
    const nodePoolWithoutAutoscaling = {
      ...nodePoolBase,
      replicas: 2,
    };
    expect(normalizeNodePool(nodePoolWithoutAutoscaling)).toEqual(nodePoolWithoutAutoscaling);
  });
});

describe('normalizeMachinePool', () => {
  const nodePoolBase = {
    kind: 'NodePool',
    href: '/api/clusters_mgmt/v1/clusters/21gitfhopbgmmfhlu65v93n4g4n3djde/node_pools/workers',
    id: 'workers',
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
  };

  it('normalizeMachinePool should keep same structure ', () => {
    const nodePoolWithoutAutoscaling = {
      ...nodePoolBase,
      replicas: 2,
    };
    expect(normalizeMachinePool(nodePoolWithoutAutoscaling)).toEqual(nodePoolWithoutAutoscaling);
  });

  it('Changes plural (min|max)_replicas to singular (min|max)_replica', () => {
    const nodePoolwithAutoScaling = {
      ...nodePoolBase,
      autoscaling: {
        min_replica: 2,
        max_replica: 5,
      },
    };

    const normalizedNodePool = {
      ...nodePoolBase,
      autoscaling: {
        min_replicas: 2,
        max_replicas: 5,
      },
    };
    expect(normalizeMachinePool(normalizedNodePool)).toEqual(nodePoolwithAutoScaling);
  });
});
