import { ClusterFromSubscription } from '~/types/types';
import { MachinePool, NodePool } from '~/types/clusters_mgmt.v1';
import totalNodesDataSelector from '../totalNodesDataSelector';
import {
  TotalNodesDataSelectorExpected,
  autoScalingAdditionalMachinePool,
  autoScalingAdditionalMachinePoolHypershift,
  clusterAndMachinePoolsDefaultExpected,
  clusterEmptyMachinePoolsAdditionalAutoscalingEnabledExpected,
  clusterEmptyMachinePoolsAdditionalAutoscalingEnabledHypershiftExpected,
  clusterEmptyMachinePoolsAutoscalingEnabledExpected,
  clusterEmptyMachinePoolsEmptyExpected,
  clusterEmptyMachinePoolsUndefinedExpected,
  computeNodesList,
  defaultClusterMachinePoolNotAutoscaling,
  defaultClusterMachinePoolNotAutoscalingHypershift,
  defaultMachinePoolList,
  notAutoScalingAdditionalMachinePool,
  reportsTotalActualComputeNodesExpected,
  reportsTotalActualComputeNodesHypershiftExpected,
  shouldCountTotalDesiredComputeNodesExpected,
  workerAndRepeatedNotAutoscalingList,
  workerMachinePool,
} from './totalNodesDataSelector.fixtures';
import { defaultClusterFromSubscription } from './defaultClusterFromSubscription.fixtures';

describe('TotalNodeDataSelector', () => {
  it.each([
    [
      'cluster empty and machine pools undefined',
      defaultClusterFromSubscription,
      undefined,
      clusterEmptyMachinePoolsUndefinedExpected,
    ],
    [
      'cluster empty and machine pools empty',
      defaultClusterFromSubscription,
      [],
      clusterEmptyMachinePoolsEmptyExpected,
    ],
    [
      'should find if autoscaling enabled when the default machine pool has autoscaling enabled',
      defaultClusterFromSubscription,
      workerAndRepeatedNotAutoscalingList,
      clusterEmptyMachinePoolsAutoscalingEnabledExpected,
    ],
    [
      'should find if autoscaling enabled when additional machine pools has autoscaling enabled',
      defaultClusterMachinePoolNotAutoscaling,
      defaultMachinePoolList,
      clusterEmptyMachinePoolsAdditionalAutoscalingEnabledExpected,
    ],
    [
      'should count total max and total min compute nodes',
      defaultClusterMachinePoolNotAutoscaling,
      defaultMachinePoolList,
      clusterAndMachinePoolsDefaultExpected,
    ],
    [
      'should count total max and total min compute nodes for hypershift',
      defaultClusterMachinePoolNotAutoscalingHypershift,
      [autoScalingAdditionalMachinePoolHypershift, autoScalingAdditionalMachinePoolHypershift],
      clusterEmptyMachinePoolsAdditionalAutoscalingEnabledHypershiftExpected,
    ],
    [
      'should count total desired compute nodes',
      defaultClusterFromSubscription,
      [workerMachinePool, notAutoScalingAdditionalMachinePool, autoScalingAdditionalMachinePool],
      shouldCountTotalDesiredComputeNodesExpected,
    ],
    [
      'reports total actual compute nodes',
      defaultClusterMachinePoolNotAutoscaling,
      computeNodesList,
      reportsTotalActualComputeNodesExpected,
    ],
    [
      'reports total actual compute nodes for hypershift cluster',
      defaultClusterMachinePoolNotAutoscalingHypershift,
      computeNodesList,
      reportsTotalActualComputeNodesHypershiftExpected,
    ],
  ])(
    '%p',
    (
      title: string,
      cluster: ClusterFromSubscription,
      machinePools: MachinePool[] | NodePool[] | undefined,
      expected: TotalNodesDataSelectorExpected,
    ) => {
      const result = totalNodesDataSelector(cluster, machinePools);

      expect(result.hasMachinePoolWithAutoscaling).toEqual(expected.hasMachinePoolWithAutoscaling);
      expect(result.totalMinNodesCount).toEqual(expected.totalMinNodesCount);
      expect(result.totalMaxNodesCount).toEqual(expected.totalMaxNodesCount);
      expect(result.totalDesiredComputeNodes).toEqual(expected.totalDesiredComputeNodes);
      expect(result.totalActualNodes).toEqual(expected.totalActualNodes);
    },
  );
});
