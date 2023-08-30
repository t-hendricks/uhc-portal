import get from 'lodash/get';
import { isHypershiftCluster } from '../ClusterDetails/clusterDetailsHelper';

const totalNodesDataSelector = (cluster, machinePools) => {
  const isHypershift = isHypershiftCluster(cluster);

  let totalDesiredComputeNodes = 0;
  let hasMachinePoolWithAutoscaling = false;
  let totalMinNodesCount = 0;
  let totalMaxNodesCount = 0;

  let totalActualNodes = get(cluster, 'metrics.nodes.compute', false);

  if (isHypershift && machinePools.length > 0) {
    totalActualNodes = machinePools.reduce(
      (total, pool) => total + get(pool, 'status.current_replicas', 0),
      0,
    );
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
    totalActualNodes,
  };
};

export default totalNodesDataSelector;
