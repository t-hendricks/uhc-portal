import { STATIC_DEFAULT_MP_ID } from '../../ClusterDetails/components/MachinePools/machinePoolsHelper';
import totalNodesDataSelector from '../totalNodesDataSelector';

// Determine whether a master instance resize alert should be shown.
// Since the threshold is depenent on the current nodes, we return it
// for inclusion in the alert itself.
const masterResizeThresholds = {
  medium: 25,
  large: 100,
};

// Determine the master machine type size according to the
// current nodes and the requested nodes.
const masterResizeAlertThresholdSelector = (
  selectedMachinePoolID,
  requestedNodes,
  cluster,
  machinePools,
) => {
  const nodes = totalNodesDataSelector(cluster, machinePools);
  const currentNodes = nodes.totalMaxNodesCount;
  let totalRequestedNodes;
  if (selectedMachinePoolID === STATIC_DEFAULT_MP_ID) {
    totalRequestedNodes = nodes.totalMaxNodesCount + (requestedNodes - nodes.totalDefaultMaxNodes);
  } else {
    const selectedMachinePool = machinePools.find(
      (machinePool) => machinePool.id === selectedMachinePoolID,
    );
    if (selectedMachinePool) {
      if (selectedMachinePool.autoscaling) {
        totalRequestedNodes =
          nodes.totalMaxNodesCount +
          (requestedNodes - selectedMachinePool.autoscaling.max_replicas);
      } else {
        totalRequestedNodes =
          nodes.totalMaxNodesCount + (requestedNodes - selectedMachinePool.replicas);
      }
    }
  }

  if (requestedNodes && currentNodes) {
    if (
      currentNodes <= masterResizeThresholds.large &&
      totalRequestedNodes > masterResizeThresholds.large
    ) {
      return masterResizeThresholds.large;
    }
    if (
      currentNodes <= masterResizeThresholds.medium &&
      totalRequestedNodes > masterResizeThresholds.medium
    ) {
      return masterResizeThresholds.medium;
    }
  }
  return 0;
};

export { masterResizeThresholds };
export default masterResizeAlertThresholdSelector;
