import masterResizeAlertThresholdSelector, {
  masterResizeThresholds,
} from '../EditNodeCountModalSelectors';
import fixtures from '../../../ClusterDetails/__test__/ClusterDetails.fixtures';

const { cluster } = fixtures.clusterDetails;

describe('masterResizeAlertThreshold Selector', () => {
  it('When scaling a cluster to more then 25 nodes with autoscaling disabled on default machinepool, return medium threshold ', () => {
    const machinePools = [
      {
        id: 'foo',
        replicas: 2,
        instance_type: 'm5.xlarge',
      },
    ];

    const result = masterResizeAlertThresholdSelector({
      selectedMachinePoolID: 'foo',
      requestedNodes: 27,
      cluster,
      machinePools,
    });

    expect(result).toEqual(masterResizeThresholds.medium);
  });

  it('When scaling a cluster to more then 100 nodes with autoscaling enabled on default machinepool, return large threshold ', () => {
    const machinePools = [
      {
        id: 'foo',
        autoscaling: {
          min_replicas: 1,
          max_replicas: 2,
        },
        instance_type: 'm5.xlarge',
      },
    ];

    const result = masterResizeAlertThresholdSelector({
      selectedMachinePoolID: 'foo',
      requestedNodes: 101,
      cluster,
      machinePools,
    });

    expect(result).toEqual(masterResizeThresholds.large);
  });

  it('When scaling a cluster with additional machinePools to more than 25 nodes, return medium threshold', () => {
    const machinePools = [
      {
        id: 'foo',
        replicas: 4,
        instance_type: 'm5.xlarge',
      },
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
    ];

    const result = masterResizeAlertThresholdSelector({
      selectedMachinePoolID: 'mp-with-label0',
      requestedNodes: 12,
      cluster,
      machinePools,
    });

    expect(result).toEqual(masterResizeThresholds.medium);
  });

  it('When scaling a cluster with "autoscaled enabled" and additional machinePools to more than 25 nodes, return medium threshold', () => {
    const machinePools = [
      {
        id: 'foo',
        autoscaling: {
          min_replicas: 7,
          max_replicas: 10,
        },
      },
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
    ];

    const result = masterResizeAlertThresholdSelector({
      selectedMachinePoolID: 'mp-with-label',
      requestedNodes: 16,
      cluster,
      machinePools,
    });

    expect(result).toEqual(masterResizeThresholds.medium);
  });

  it('When scaling a cluster with additional "autoscaled enabled" machinePools to more than 25 nodes, return medium threshold', () => {
    const machinePools = [
      {
        id: 'foo',
        replicas: 4,
      },
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
    ];

    const result = masterResizeAlertThresholdSelector({
      selectedMachinePoolID: 'mp-with-label0',
      requestedNodes: 9,
      cluster,
      machinePools,
    });

    expect(result).toEqual(masterResizeThresholds.medium);
  });

  it('When scaling a cluster to less then 25 nodes, return 0', () => {
    const machinePools = [
      {
        id: 'foo',
        replicas: 2,
        instance_type: 'm5.xlarge',
      },
    ];

    const result = masterResizeAlertThresholdSelector({
      selectedMachinePoolID: 'foo',
      requestedNodes: 6,
      cluster,
      machinePools,
    });

    expect(result).toEqual(0);
  });
});
