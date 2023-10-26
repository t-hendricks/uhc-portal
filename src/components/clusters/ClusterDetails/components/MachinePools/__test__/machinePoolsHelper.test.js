import { normalizedProducts } from '../../../../../../common/subscriptionTypes';
import {
  actionResolver,
  parseLabels,
  parseTags,
  normalizeNodePool,
  normalizeMachinePool,
  isMinimumCountWithoutTaints,
  minReplicasNeededText,
  isEnforcedDefaultMachinePool,
} from '../machinePoolsHelper';

describe('machine pools action resolver', () => {
  const onClickDelete = jest.fn();
  const onClickEdit = jest.fn();

  const editAction = {
    title: 'Edit',
    onClick: onClickEdit,
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
        onClickEdit,
        machinePools: [],
      }),
    ).toEqual(expect.arrayContaining([]));
  });

  it('should have edit and delete actions', () => {
    const machinePoolRowData = {
      cells: ['test-mp', 'm5.xlarge', 'us-east-1a', '4'],
      machinePool: { id: 'test-mp' },
      key: 'test-mp',
    };
    const expected = [editAction, deleteAction];
    expect(
      actionResolver({
        rowData: machinePoolRowData,
        onClickDelete,
        onClickEdit,
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

  it('disables Delete for enforced default pool', () => {
    const defaultMachinePoolRowData = {
      cells: ['worker', 'm5.xlarge', 'us-east-1a', '4'],
      machinePool: { id: 'worker' },
      key: 'worker',
    };
    const deleteDisabledAction = {
      ...deleteAction,
      isAriaDisabled: true,
      tooltip: 'Default machine pool cannot be deleted',
    };
    const expected = [editAction, deleteDisabledAction];
    expect(
      actionResolver({
        rowData: defaultMachinePoolRowData,
        onClickDelete,
        onClickEdit,
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
    const deleteDisabledAction = {
      ...deleteAction,
      isAriaDisabled: true,
      tooltip: 'Default machine pool cannot be deleted',
    };

    const expected = [editAction, deleteDisabledAction];
    const actions = actionResolver({
      rowData: defaultMachinePoolRowData,
      onClickDelete,
      onClickEdit,
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

  it('disables delete for HCP cluster if less than 2 replicas without taints', () => {
    const actions = actionResolver({
      rowData: { machinePool: { id: 'mp-no-taints' } },
      onClickDelete,
      onClickEdit,
      canDelete: true,
      machinePools: [
        {
          id: 'mp-with-taints',
          replicas: 2,
          taints: [{ key: 'hello', value: 'world', effect: 'NoSchedule' }],
        },
        {
          id: 'mp1',
          replicas: 1,
        },
        {
          id: 'mp-no-taints',
          replicas: 1,
        },
      ],
      cluster: {
        product: {
          id: normalizedProducts.ROSA,
        },
        hypershift: { enabled: true },
        ccs: {
          enabled: true,
        },
      },
      machineTypes: {},
    });

    actions.forEach((action) => {
      if (action.title === 'Delete') {
        expect(action.isAriaDisabled).toBeTruthy();
        expect(action.tooltip).toEqual(minReplicasNeededText);
      }
      if (action.title === 'Edit') {
        expect(action.isAriaDisabled).toBeFalsy();
      }
    });
  });

  it('enables delete and edit for HCP cluster if  2 replicas without taints', () => {
    const actions = actionResolver({
      rowData: { machinePool: { id: 'mp-with-taints' } },
      onClickDelete,
      onClickEdit,
      canDelete: true,
      machinePools: [
        {
          id: 'mp-with-taints',
          replicas: 2,
          taints: [{ key: 'hello', value: 'world', effect: 'NoSchedule' }],
        },
        {
          id: 'mp1',
          replicas: 1,
        },
        {
          id: 'mp-no-taints',
          replicas: 1,
        },
      ],
      cluster: {
        product: {
          id: normalizedProducts.ROSA,
        },
        hypershift: { enabled: true },
        ccs: {
          enabled: true,
        },
      },
      machineTypes: {},
    });

    actions.forEach((action) => {
      if (action.title === 'Delete') {
        expect(action.isAriaDisabled).toBeFalsy();
      }
      if (action.title === 'Edit') {
        expect(action.isAriaDisabled).toBeFalsy();
      }
    });
  });
});

describe('isMinimumCountWithoutTaints ', () => {
  const machinePools = [
    {
      id: 'mp-with-taints',
      replicas: 2,
      taints: [{ key: 'hello', value: 'world', effect: 'NoSchedule' }],
    },
    {
      id: 'mp1',
      replicas: 1,
    },
    {
      id: 'mp-no-taints',
      replicas: 1,
    },
  ];

  const machinePoolsScaled = [
    {
      id: 'mp-with-taints',
      taints: [{ key: 'hello', value: 'world', effect: 'NoSchedule' }],
      autoscaling: {
        min_replicas: 2,
        max_replicas: 3,
      },
    },
    {
      id: 'mp1',
      autoscaling: {
        min_replicas: 1,
        max_replicas: 3,
      },
    },
    {
      id: 'mp-no-taints',
      autoscaling: {
        min_replicas: 1,
        max_replicas: 3,
      },
    },
  ];

  const cluster = {
    hypershift: { enabled: true },
  };
  describe('HCP clusters', () => {
    it('returns false if less than 2 nodes without taints - no scaling', () => {
      expect(
        isMinimumCountWithoutTaints({
          cluster,
          machinePools,
          currentMachinePoolId: 'mp-no-taints',
        }),
      ).toBeFalsy();
    });

    it('returns false if less than 2 autoscaled nodes without taints - no scaling', () => {
      expect(
        isMinimumCountWithoutTaints({
          cluster,
          machinePools: machinePoolsScaled,
          currentMachinePoolId: 'mp-no-taints',
        }),
      ).toBeFalsy();
    });

    it('returns true if  2 nodes without taints', () => {
      expect(
        isMinimumCountWithoutTaints({
          cluster,
          machinePools,
          currentMachinePoolId: 'mp-with-taints',
        }),
      ).toBeTruthy();
    });

    it('returns true if 2 autoscaled nodes without taints', () => {
      expect(
        isMinimumCountWithoutTaints({
          cluster,
          machinePools: machinePoolsScaled,
          currentMachinePoolId: 'mp-with-taints',
        }),
      ).toBeTruthy();
    });
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
      instance_type: nodePoolBase.aws_node_pool.instance_type,
    };
    expect(normalizeNodePool(nodePoolwithAutoScaling)).toEqual(normalizedNodePool);
  });

  it('should normalize instance_type', () => {
    const nodePoolWithoutAutoscaling = {
      ...nodePoolBase,
      replicas: 2,
    };
    expect(normalizeNodePool(nodePoolWithoutAutoscaling)).toEqual({
      ...nodePoolWithoutAutoscaling,
      instance_type: nodePoolBase.aws_node_pool.instance_type,
    });
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

describe('isEnforcedDefaultMachinePool', () => {
  const machineTypes = {
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
  it('Non-CCS: worker MP is always default', () => {
    expect(
      isEnforcedDefaultMachinePool(
        'worker',
        [],
        {},
        {
          ccs: {
            enabled: false,
          },
        },
      ),
    ).toBeTruthy();
  });
  it('Non-CCS: non-worker MP is always default', () => {
    expect(
      isEnforcedDefaultMachinePool(
        'worker-1',
        [],
        {},
        {
          ccs: {
            enabled: false,
          },
        },
      ),
    ).toBeFalsy();
  });
  it('Hypershift: Does not have default MP', () => {
    expect(
      isEnforcedDefaultMachinePool(
        'worker',
        [],
        {},
        {
          hypershift: {
            enabled: true,
          },
        },
      ),
    ).toBeFalsy();
  });
  it('CCS GCP: Detects default pool', () => {
    const cluster = {
      ccs: {
        enabled: true,
      },
      cloud_provider: {
        id: 'gcp',
      },
    };
    const machinePools = [
      {
        id: 'foo',
        instance_type: 'custom-6',
        replicas: 1,
      },
      {
        id: 'bar',
        instance_type: 'custom-6',
        replicas: 2,
      },
    ];
    const machineTypes = {
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
        gcp: [
          {
            id: 'custom-6',
            cpu: {
              value: 6,
            },
            memory: {
              value: 6,
            },
          },
        ],
      },
    };

    expect(isEnforcedDefaultMachinePool('bar', machinePools, machineTypes, cluster)).toBeTruthy();
    expect(isEnforcedDefaultMachinePool('foo', machinePools, machineTypes, cluster)).toBeFalsy();
  });
  it('CCS: Detects default pool among multiple pools - one has too little replicas', () => {
    const cluster = {
      ccs: {
        enabled: true,
      },
      cloud_provider: {
        id: 'aws',
      },
    };
    const machinePools = [
      {
        id: 'foo',
        instance_type: 'm5.xlarge',
        replicas: 1,
      },
      {
        id: 'bar',
        instance_type: 'm5.xlarge',
        replicas: 2,
      },
    ];

    expect(isEnforcedDefaultMachinePool('bar', machinePools, machineTypes, cluster)).toBeTruthy();
    expect(isEnforcedDefaultMachinePool('foo', machinePools, machineTypes, cluster)).toBeFalsy();
  });
  it('CCS: Detects default pool among multiple pools - one has taints', () => {
    const cluster = {
      ccs: {
        enabled: true,
      },
      cloud_provider: {
        id: 'aws',
      },
    };
    const machinePools = [
      {
        id: 'foo',
        instance_type: 'm5.xlarge',
        replicas: 2,
        taints: [
          {
            key: 'foo',
          },
        ],
      },
      {
        id: 'bar',
        instance_type: 'm5.xlarge',
        replicas: 2,
      },
    ];
    expect(isEnforcedDefaultMachinePool('bar', machinePools, machineTypes, cluster)).toBeTruthy();
    expect(isEnforcedDefaultMachinePool('foo', machinePools, machineTypes, cluster)).toBeFalsy();
  });
  it('CCS: Detects default pool among multiple pools - autoscale', () => {
    const cluster = {
      ccs: {
        enabled: true,
      },
      cloud_provider: {
        id: 'aws',
      },
    };
    const machinePools = [
      {
        id: 'foo',
        instance_type: 'm5.xlarge',
        autoscaling: {
          min_replicas: 1,
        },
      },
      {
        id: 'bar',
        instance_type: 'm5.xlarge',
        autoscaling: {
          min_replicas: 2,
        },
      },
    ];
    expect(isEnforcedDefaultMachinePool('bar', machinePools, machineTypes, cluster)).toBeTruthy();
    expect(isEnforcedDefaultMachinePool('foo', machinePools, machineTypes, cluster)).toBeFalsy();
  });
  it('CCS: Detects default pool among multiple pools - multiaz', () => {
    const cluster = {
      ccs: {
        enabled: true,
      },
      cloud_provider: {
        id: 'aws',
      },
      multi_az: true,
    };
    const machinePools = [
      {
        id: 'foo',
        instance_type: 'm5.xlarge',
        autoscaling: {
          min_replicas: 2,
        },
      },
      {
        id: 'bar',
        instance_type: 'm5.xlarge',
        autoscaling: {
          min_replicas: 3,
        },
      },
    ];
    expect(isEnforcedDefaultMachinePool('bar', machinePools, machineTypes, cluster)).toBeTruthy();
    expect(isEnforcedDefaultMachinePool('foo', machinePools, machineTypes, cluster)).toBeFalsy();
  });
});
