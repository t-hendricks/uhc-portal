import get from 'lodash/get';
import { isHypershiftCluster } from '../ClusterDetails/clusterDetailsHelper';

const totalNodesDataSelector = (cluster, machinePools) => {
  const isHypershift = isHypershiftCluster(cluster);

  let totalDesiredComputeNodes = isHypershift ? 0 : get(cluster, 'nodes.compute', 0);
  let hasMachinePoolWithAutoscaling = false;
  let totalMinNodesCount = 0;
  let totalMaxNodesCount = 0;
  let totalDefaultMaxNodes = 0;
  let totalDefaultMinNods = 0;

  const defaultMachineAutoscale = get(cluster, 'nodes.autoscale_compute', false);

  let totalActualNodes = get(cluster, 'metrics.nodes.compute', false);

  if (isHypershift && machinePools) {
    totalActualNodes = machinePools.reduce(
      (total, pool) => total + get(pool, 'status.current_replicas', 0),
      0,
    );
  }

  if (defaultMachineAutoscale && !isHypershift) {
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
        if (isHypershift) {
          totalMinNodesCount += machinePool.autoscaling.min_replica;
          totalMaxNodesCount += machinePool.autoscaling.max_replica;
        } else {
          totalMinNodesCount += machinePool.autoscaling.min_replicas;
          totalMaxNodesCount += machinePool.autoscaling.max_replicas;
        }
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
    totalActualNodes,
  };
};

export default totalNodesDataSelector;
