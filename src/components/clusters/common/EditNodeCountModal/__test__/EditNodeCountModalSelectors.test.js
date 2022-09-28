import masterResizeAlertThresholdSelector, {
  masterResizeThresholds,
} from '../EditNodeCountModalSelectors';
import fixtures from '../../../ClusterDetails/__test__/ClusterDetails.fixtures';

const DEFAULT_MACHINE_POOL_ID = 'Default';

describe('masterResizeAlertThreshold Selector', () => {
  const modalState = { data: { cluster: { ...fixtures.clusterDetails.cluster } } };

  it('When scaling a cluster to more then 25 nodes with autoscaling disabled on default machinepool, return medium threshold ', () => {
    const state = {
      clusters: {
        details: {
          cluster: {
            nodes: {
              compute: 4,
            },
          },
        },
      },
      machinePools: {
        getMachinePools: {
          data: [],
        },
      },
      modal: modalState,
      form: { EditNodeCount: { values: { nodes_compute: '27' } } },
    };

    const requestedNodes = parseInt(state.form.EditNodeCount.values.nodes_compute, 10);
    const result = masterResizeAlertThresholdSelector(
      DEFAULT_MACHINE_POOL_ID,
      requestedNodes,
      state.clusters.details.cluster,
      state.machinePools.getMachinePools.data,
    );

    expect(result).toEqual(masterResizeThresholds.medium);
  });

  it('When scaling a cluster to more then 100 nodes with autoscaling enabled on default machinepool, return large threshold ', () => {
    const state = {
      clusters: {
        details: {
          cluster: {
            nodes: {
              autoscale_compute: {
                min_replicas: 7,
                max_replicas: 9,
              },
            },
          },
        },
      },
      machinePools: {
        getMachinePools: {
          data: [],
        },
      },

      modal: modalState,
      form: { EditNodeCount: { values: { nodes_compute: '101' } } },
    };

    const requestedNodes = parseInt(state.form.EditNodeCount.values.nodes_compute, 10);
    const result = masterResizeAlertThresholdSelector(
      DEFAULT_MACHINE_POOL_ID,
      requestedNodes,
      state.clusters.details.cluster,
      state.machinePools.getMachinePools.data,
    );

    expect(result).toEqual(masterResizeThresholds.large);
  });

  it('When scaling a cluster with additional machinePools to more than 25 nodes, return medium threshold', () => {
    const state = {
      clusters: {
        details: {
          cluster: {
            nodes: {
              compute: 4,
            },
          },
        },
      },
      machinePools: {
        getMachinePools: {
          data: [
            {
              availability_zones: ['us-east-1a'],
              href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/fake2',
              id: 'mp-with-label0',
              instance_type: 'm5.xlarge',
              kind: 'MachinePool',
              replicas: 7,
            },
            {
              availability_zones: ['us-east-1a'],
              href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/fake2',
              id: 'mp-with-label1',
              instance_type: 'm5.xlarge',
              kind: 'MachinePool',
              replicas: 10,
            },
          ],
        },
      },
      // This cluster is scaled from 21 to 30 > medium threshold.
      form: { EditNodeCount: { values: { nodes_compute: '9' } } },
    };

    const requestedNodes = parseInt(state.form.EditNodeCount.values.nodes_compute, 10);
    const result = masterResizeAlertThresholdSelector(
      DEFAULT_MACHINE_POOL_ID,
      requestedNodes,
      state.clusters.details.cluster,
      state.machinePools.getMachinePools.data,
    );

    expect(result).toEqual(masterResizeThresholds.medium);
  });

  it('When scaling a cluster with "autoscaled enabled" and additional machinePools to more than 25 nodes, return medium threshold', () => {
    const state = {
      clusters: {
        details: {
          cluster: {
            nodes: {
              autoscale_compute: {
                min_replicas: 7,
                max_replicas: 10,
              },
            },
          },
        },
      },
      machinePools: {
        getMachinePools: {
          data: [
            {
              availability_zones: ['us-east-1a'],
              href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/fake2',
              id: 'mp-with-label',
              instance_type: 'm5.xlarge',
              kind: 'MachinePool',
              autoscaling: {
                min_replicas: 10,
                max_replicas: 14,
              },
            },
          ],
        },
      },
      // This cluster is scaled from 17 to 26 > medium threshold.
      // The threshold logic takes into account the *max replicas* to calculate
      form: { EditNodeCount: { values: { nodes_compute: '16' } } },
    };

    const requestedNodes = parseInt(state.form.EditNodeCount.values.nodes_compute, 10);
    const result = masterResizeAlertThresholdSelector(
      'mp-with-label',
      requestedNodes,
      state.clusters.details.cluster,
      state.machinePools.getMachinePools.data,
    );

    expect(result).toEqual(masterResizeThresholds.medium);
  });

  it('When scaling a cluster with additional "autoscaled enabled" machinePools to more than 25 nodes, return medium threshold', () => {
    const state = {
      clusters: {
        details: {
          cluster: {
            nodes: {
              compute: 4,
            },
          },
        },
      },
      machinePools: {
        getMachinePools: {
          data: [
            {
              availability_zones: ['us-east-1a'],
              href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/fake2',
              id: 'mp-with-label0',
              instance_type: 'm5.xlarge',
              kind: 'MachinePool',
              autoscaling: {
                min_replicas: 3,
                max_replicas: 4,
              },
            },
            {
              availability_zones: ['us-east-1a'],
              href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/fake2',
              id: 'mp-with-label1',
              instance_type: 'm5.xlarge',
              kind: 'MachinePool',
              autoscaling: {
                min_replicas: 10,
                max_replicas: 15,
              },
            },
          ],
        },
      },
      // This cluster is scaled from 19 to 26 > medium threshold.
      // The threshold logic takes into account the *min replicas* to calculate
      form: { EditNodeCount: { values: { nodes_compute: '9' } } },
    };

    const requestedNodes = parseInt(state.form.EditNodeCount.values.nodes_compute, 10);
    const result = masterResizeAlertThresholdSelector(
      'mp-with-label0',
      requestedNodes,
      state.clusters.details.cluster,
      state.machinePools.getMachinePools.data,
    );

    expect(result).toEqual(masterResizeThresholds.medium);
  });

  it('When scaling a cluster to less then 25 nodes, return 0', () => {
    const state = {
      modal: modalState,
      form: { EditNodeCount: { values: { nodes_compute: '6' } } },
      clusters: {
        details: {
          cluster: {
            nodes: {
              compute: 10,
            },
          },
        },
      },
      machinePools: {
        getMachinePools: {
          data: [],
        },
      },
    };

    const requestedNodes = parseInt(state.form.EditNodeCount.values.nodes_compute, 10);
    const result = masterResizeAlertThresholdSelector(
      DEFAULT_MACHINE_POOL_ID,
      requestedNodes,
      state.clusters.details.cluster,
      state.machinePools.getMachinePools.data,
    );

    expect(result).toEqual(0);
  });
});
