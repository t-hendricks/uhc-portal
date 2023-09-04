import nodesSectionDataSelector from './totalNodesDataSelector';

const clusterState = {
  details: {
    cluster: {},
  },
};

const defaultMachinePoolNotAutoscalingState = {
  details: { cluster: { nodes: { compute: 4 }, metrics: { nodes: { compute: 2 } } } },
};

const workerMachinePool = {
  availability_zones: ['us-east-1a'],
  href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/fake2',
  id: 'worker',
  instance_type: 'm5.xlarge',
  kind: 'MachinePool',
  replicas: 4,
};

const workerAutoscaleMachinePool = {
  availability_zones: ['us-east-1a'],
  href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/fake2',
  id: 'worker',
  instance_type: 'm5.xlarge',
  kind: 'MachinePool',
  autoscaling: {
    min_replicas: 4,
    max_replicas: 6,
  },
};
const autoScalingAdditionalMachinePool = {
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
const autoScalingAdditionalMachinePoolHypershift = {
  availability_zones: ['us-east-1a'],
  href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/fake2',
  id: 'mp-with-label',
  instance_type: 'm5.xlarge',
  kind: 'MachinePool',
  autoscaling: {
    min_replica: 3,
    max_replica: 4,
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

const nonAutoScalingNodePool = {
  status: { current_replicas: 5 },
};
const additionalNonAutoScalingNodePool = {
  status: { current_replicas: 6 },
};

describe('TotalNodeDataSelector', () => {
  it('should find if autoscaling enabled when the default machine pool has autoscaling enabled', () => {
    const state = {
      clusters: { ...clusterState },
      machinePools: {
        getMachinePools: {
          data: [
            workerAutoscaleMachinePool,
            notAutoScalingAdditionalMachinePool,
            notAutoScalingAdditionalMachinePool,
          ],
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
          data: [
            workerMachinePool,
            notAutoScalingAdditionalMachinePool,
            autoScalingAdditionalMachinePool,
          ],
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
      clusters: { ...clusterState },
      machinePools: {
        getMachinePools: {
          data: [
            workerAutoscaleMachinePool,
            notAutoScalingAdditionalMachinePool,
            autoScalingAdditionalMachinePool,
          ],
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

  it('should count total max and total min compute nodes for hypershift', () => {
    const state = {
      clusters: {
        details: {
          cluster: {
            ...defaultMachinePoolNotAutoscalingState.details.cluster,
            hypershift: { enabled: true },
          },
        },
      },
      machinePools: {
        getMachinePools: {
          data: [
            autoScalingAdditionalMachinePoolHypershift,
            autoScalingAdditionalMachinePoolHypershift,
          ],
        },
      },
    };

    const result = nodesSectionDataSelector(
      state.clusters.details.cluster,
      state.machinePools.getMachinePools.data,
    );

    expect(result).toHaveProperty('totalMinNodesCount', 6);
    expect(result).toHaveProperty('totalMaxNodesCount', 8);
  });

  it('should count total desired compute nodes', () => {
    const state = {
      clusters: { ...defaultMachinePoolNotAutoscalingState },
      machinePools: {
        getMachinePools: {
          data: [
            workerMachinePool,
            notAutoScalingAdditionalMachinePool,
            autoScalingAdditionalMachinePool,
          ],
        },
      },
    };

    const result = nodesSectionDataSelector(
      state.clusters.details.cluster,
      state.machinePools.getMachinePools.data,
    );
    expect(result).toHaveProperty('totalDesiredComputeNodes', 6);
  });

  it('reports total actual compute nodes', () => {
    const state = {
      clusters: { ...defaultMachinePoolNotAutoscalingState },
      machinePools: {
        getMachinePools: {
          data: [workerMachinePool, nonAutoScalingNodePool, additionalNonAutoScalingNodePool],
        },
      },
    };
    const { totalActualNodes } = nodesSectionDataSelector(
      state.clusters.details.cluster,
      state.machinePools.getMachinePools.data,
    );

    expect(totalActualNodes).toEqual(2); // details.cluster.metrics.nodes.compute: 2
  });

  it('reports total actual compute nodes for hypershift cluster', () => {
    const state = {
      clusters: {
        details: {
          cluster: {
            ...defaultMachinePoolNotAutoscalingState.details.cluster,
            hypershift: { enabled: true },
          },
        },
      },
      machinePools: {
        getMachinePools: {
          data: [workerMachinePool, nonAutoScalingNodePool, additionalNonAutoScalingNodePool],
        },
      },
    };
    const { totalActualNodes } = nodesSectionDataSelector(
      state.clusters.details.cluster,
      state.machinePools.getMachinePools.data,
    );

    expect(totalActualNodes).toEqual(11); // addition of machinepool.status.current_replicas
  });
});
