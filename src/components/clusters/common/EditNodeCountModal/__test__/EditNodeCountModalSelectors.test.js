import masterResizeAlertThresholdSelector, {
  masterResizeThresholds,
} from '../EditNodeCountModalSelectors';
import fixtures from '../../../ClusterDetails/__test__/ClusterDetails.fixtures';

const machineTypes = {
  types: {
    aws: [
      {
        id: 'm5.xlarge',
        cpu: {
          value: 4,
        },
        memory: {
          memory: 4,
        },
      },
    ],
  },
};

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
            ccs: {
              enabled: true,
            },
          },
        },
      },
      machinePools: {
        getMachinePools: {
          data: [
            {
              id: 'foo',
              replicas: 2,
              instance_type: 'm5.xlarge',
            },
          ],
        },
      },
      modal: modalState,
      form: { EditNodeCount: { values: { nodes_compute: '27' } } },
    };

    const requestedNodes = parseInt(state.form.EditNodeCount.values.nodes_compute, 10);
    const result = masterResizeAlertThresholdSelector({
      selectedMachinePoolID: 'foo',
      requestedNodes,
      cluster: state.clusters.details.cluster,
      machinePools: state.machinePools.getMachinePools.data,
      machineTypes,
    });

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
            ccs: {
              enabled: true,
            },
          },
        },
      },
      machinePools: {
        getMachinePools: {
          data: [
            {
              id: 'foo',
              replicas: 2,
              instance_type: 'm5.xlarge',
            },
          ],
        },
      },
      modal: modalState,
      form: { EditNodeCount: { values: { nodes_compute: '101' } } },
    };

    const requestedNodes = parseInt(state.form.EditNodeCount.values.nodes_compute, 10);
    const result = masterResizeAlertThresholdSelector({
      selectedMachinePoolID: 'foo',
      requestedNodes,
      cluster: state.clusters.details.cluster,
      machinePools: state.machinePools.getMachinePools.data,
      machineTypes,
    });

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
            ccs: {
              enabled: true,
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
    const result = masterResizeAlertThresholdSelector({
      selectedMachinePoolID: 'mp-with-label0',
      requestedNodes,
      cluster: state.clusters.details.cluster,
      machinePools: state.machinePools.getMachinePools.data,
      machineTypes,
    });

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
            ccs: {
              enabled: true,
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
    const result = masterResizeAlertThresholdSelector({
      selectedMachinePoolID: 'mp-with-label',
      requestedNodes,
      cluster: state.clusters.details.cluster,
      machinePools: state.machinePools.getMachinePools.data,
      machineTypes,
    });

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
            ccs: {
              enabled: true,
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
    const result = masterResizeAlertThresholdSelector({
      selectedMachinePoolID: 'mp-with-label0',
      requestedNodes,
      cluster: state.clusters.details.cluster,
      machinePools: state.machinePools.getMachinePools.data,
      machineTypes,
    });

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
            ccs: {
              enabled: true,
            },
          },
        },
      },
      machinePools: {
        getMachinePools: {
          data: [
            {
              id: 'foo',
              replicas: 2,
              instance_type: 'm5.xlarge',
            },
          ],
        },
      },
    };

    const requestedNodes = parseInt(state.form.EditNodeCount.values.nodes_compute, 10);
    const result = masterResizeAlertThresholdSelector({
      selectedMachinePoolID: 'foo',
      requestedNodes,
      cluster: state.clusters.details.cluster,
      machinePools: state.machinePools.getMachinePools.data,
      machineTypes,
    });

    expect(result).toEqual(0);
  });
});
