import get from 'lodash/get';

const totalNodesDataSelector = (cluster, machinePools) => {
  let totalDesiredComputeNodes = get(cluster, 'nodes.compute', 0);
  let hasMachinePoolWithAutoscaling = false;
  let totalMinNodesCount = 0;
  let totalMaxNodesCount = 0;
  let totalDefaultMaxNodes = 0;
  let totalDefaultMinNods = 0;
  const defaultMachineAutoscale = get(cluster, 'nodes.autoscale_compute', false);

  if (defaultMachineAutoscale) {
    hasMachinePoolWithAutoscaling = true;
    totalMinNodesCount = defaultMachineAutoscale.min_replicas;
    totalDefaultMinNods = defaultMachineAutoscale.min_replicas;
    totalMaxNodesCount = defaultMachineAutoscale.max_replicas;
    totalDefaultMaxNodes = defaultMachineAutoscale.max_replicas;
  } else {
    totalMinNodesCount += totalDesiredComputeNodes;
    totalMaxNodesCount += totalDesiredComputeNodes;
    totalDefaultMinNods = totalDesiredComputeNodes;
    totalDefaultMaxNodes = totalDesiredComputeNodes;
  }

  if (machinePools) {
    machinePools.forEach((machinePool) => {
      const machinePoolAutoscaling = !!machinePool.autoscaling;
      if (machinePoolAutoscaling) {
        hasMachinePoolWithAutoscaling = true;
        totalMinNodesCount += machinePool.autoscaling.min_replicas;
        totalMaxNodesCount += machinePool.autoscaling.max_replicas;
      } else {
        totalDesiredComputeNodes += machinePool.replicas;
        totalMinNodesCount += machinePool.replicas;
        totalMaxNodesCount += machinePool.replicas;
      }
    });
  }

  return {
    totalDesiredComputeNodes,
    hasMachinePoolWithAutoscaling,
    totalMinNodesCount,
    totalMaxNodesCount,
    totalDefaultMaxNodes,
    totalDefaultMinNods,
  };
};

export default totalNodesDataSelector;
