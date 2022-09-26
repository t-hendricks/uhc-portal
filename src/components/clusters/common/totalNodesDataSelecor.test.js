import nodesSectionDataSelector from './totalNodesDataSelector';

const defaultMachinePoolAutoscalingState = {
  details: {
    cluster: {
      nodes: {
        autoscale_compute: {
          min_replicas: 4,
          max_replicas: 6,
        },
      },
    },
  },
};

const defaultMachinePoolNotAutoscalingState = { details: { cluster: { nodes: { compute: 4 } } } };

const autoScalingAdiitionalMachinePool = {
  availability_zones: ['us-east-1a'],
  href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/fake2',
  id: 'mp-with-label',
  instance_type: 'm5.xlarge',
  kind: 'MachinePool',
  autoscaling: {
    min_replicas: 3,
    max_replicas: 4,
  },
};

const notAutoScalingAdditionalMachinePool = {
  availability_zones: ['us-east-1a'],
  href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/fake1',
  id: 'mp-with-labels-and-taints',
  instance_type: 'm5.xlarge',
  kind: 'MachinePool',
  replicas: 2,
};

it('should find if autoscaling enabled when the default machine pool has autoscaling enabled', () => {
  const state = {
    clusters: { ...defaultMachinePoolAutoscalingState },
    machinePools: {
      getMachinePools: {
        data: [notAutoScalingAdditionalMachinePool, notAutoScalingAdditionalMachinePool],
      },
    },
  };

  const result = nodesSectionDataSelector(
    state.clusters.details.cluster,
    state.machinePools.getMachinePools.data,
  );
  expect(result).toHaveProperty('hasMachinePoolWithAutoscaling', true);
});

it('should find if autoscaling enabled when andditional machine pools has autoscaling enabled', () => {
  const state = {
    clusters: { ...defaultMachinePoolNotAutoscalingState },
    machinePools: {
      getMachinePools: {
        data: [notAutoScalingAdditionalMachinePool, autoScalingAdiitionalMachinePool],
      },
    },
  };

  const result = nodesSectionDataSelector(
    state.clusters.details.cluster,
    state.machinePools.getMachinePools.data,
  );
  expect(result).toHaveProperty('hasMachinePoolWithAutoscaling', true);
});

it('should count total max and total min compute nodes', () => {
  const state = {
    clusters: { ...defaultMachinePoolAutoscalingState },
    machinePools: {
      getMachinePools: {
        data: [notAutoScalingAdditionalMachinePool, autoScalingAdiitionalMachinePool],
      },
    },
  };

  const result = nodesSectionDataSelector(
    state.clusters.details.cluster,
    state.machinePools.getMachinePools.data,
  );

  expect(result).toHaveProperty('totalMinNodesCount', 9);
  expect(result).toHaveProperty('totalMaxNodesCount', 12);
});

it('should count total desired compute nodes', () => {
  const state = {
    clusters: { ...defaultMachinePoolNotAutoscalingState },
    machinePools: {
      getMachinePools: {
        data: [notAutoScalingAdditionalMachinePool, autoScalingAdiitionalMachinePool],
      },
    },
  };

  const result = nodesSectionDataSelector(
    state.clusters.details.cluster,
    state.machinePools.getMachinePools.data,
  );
  expect(result).toHaveProperty('totalDesiredComputeNodes', 6);
});
