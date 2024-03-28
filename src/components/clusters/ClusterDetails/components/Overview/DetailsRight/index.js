import { connect } from 'react-redux';

import totalNodesDataSelector from '../../../../common/totalNodesDataSelector';

import DetailsRight from './DetailsRight';

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const machinePools = state.machinePools.getMachinePools.data;
  const nodesSectionData = totalNodesDataSelector(cluster, machinePools);
  const hasAutoscaleCluster = !!cluster?.autoscaler;

  const {
    hasMachinePoolWithAutoscaling,
    totalMinNodesCount,
    totalMaxNodesCount,
    totalDesiredComputeNodes,
    totalActualNodes,
  } = nodesSectionData;

  if (hasMachinePoolWithAutoscaling) {
    return {
      hasAutoscaleMachinePools: true,
      hasAutoscaleCluster,
      totalMinNodesCount,
      totalMaxNodesCount,
      totalActualNodes,
      machinePools,
    };
  }

  return {
    hasAutoscaleMachinePools: false,
    hasAutoscaleCluster,
    totalDesiredComputeNodes,
    totalActualNodes,
    limitedSupport: cluster?.status?.limited_support_reason_count > 0,
    machinePools,
  };
};

export default connect(mapStateToProps, null)(DetailsRight);
