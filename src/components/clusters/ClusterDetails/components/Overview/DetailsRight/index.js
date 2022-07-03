import { connect } from 'react-redux';
import DetailsRight from './DetailsRight';
import totalNodesDataSelector from '../../../../common/totalNodesDataSelector';

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const machinePools = state.machinePools.getMachinePools.data;
  const nodesSectionData = totalNodesDataSelector(cluster, machinePools);

  const {
    hasMachinePoolWithAutoscaling, totalMinNodesCount, totalMaxNodesCount, totalDesiredComputeNodes,
  } = nodesSectionData;

  if (hasMachinePoolWithAutoscaling) {
    return {
      autoscaleEnabled: hasMachinePoolWithAutoscaling,
      totalMinNodesCount,
      totalMaxNodesCount,
    };
  }
  return {
    autoscaleEnabled: hasMachinePoolWithAutoscaling,
    totalDesiredComputeNodes,
    limitedSupport: cluster.status.limited_support_reason_count > 0,
  };
};

export default connect(mapStateToProps, null)(DetailsRight);
