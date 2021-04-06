import get from 'lodash/get';

const nodesSectionDataSelector = (state) => {
  let totalDesiredComputeNodes = get(state, 'clusters.details.cluster.nodes.compute', 0);
  let hasMachinePoolWithAutoscaling = false;
  let totalMinNodesCount = 0;
  let totalMaxNodesCount = 0;
  const defaultMachineAutoscale = get(state, 'clusters.details.cluster.nodes.autoscale_compute');

  if (defaultMachineAutoscale) {
    hasMachinePoolWithAutoscaling = true;
    totalMinNodesCount = defaultMachineAutoscale.min_replicas;
    totalMaxNodesCount = defaultMachineAutoscale.max_replicas;
  } else {
    totalMinNodesCount += totalDesiredComputeNodes;
    totalMaxNodesCount += totalDesiredComputeNodes;
  }

  state.machinePools.getMachinePools.data.forEach((machinePool) => {
    const machinePoolAutoscaling = !!machinePool.autoscaling;

    if (machinePoolAutoscaling) {
      if (!hasMachinePoolWithAutoscaling) {
        hasMachinePoolWithAutoscaling = true;
      }
      totalMinNodesCount += machinePool.autoscaling.min_replicas;
      totalMaxNodesCount += machinePool.autoscaling.max_replicas;
    } else {
      totalDesiredComputeNodes += machinePool.replicas;
      totalMinNodesCount += machinePool.replicas;
      totalMaxNodesCount += machinePool.replicas;
    }
  });

  return ({
    totalDesiredComputeNodes, hasMachinePoolWithAutoscaling, totalMinNodesCount, totalMaxNodesCount,
  });
};

export default nodesSectionDataSelector;
