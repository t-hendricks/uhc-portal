import { connect } from 'react-redux';
import { canAutoScaleOnCreateSelector } from '~/components/clusters/ClusterDetails/components/MachinePools/MachinePoolsSelectors';
import DetailsRight from './DetailsRight';
import totalNodesDataSelector from '../../../../common/totalNodesDataSelector';

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const machinePools = state.machinePools.getMachinePools.data;
  const nodesSectionData = totalNodesDataSelector(cluster, machinePools);
  const canAutoscaleCluster = canAutoScaleOnCreateSelector(state, cluster?.subscription?.plan?.id);
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
      canAutoscaleCluster,
      hasAutoscaleMachinePools: true,
      hasAutoscaleCluster,
      totalMinNodesCount,
      totalMaxNodesCount,
      totalActualNodes,
      machinePools,
    };
  }
  return {
    canAutoscaleCluster,
    hasAutoscaleMachinePools: false,
    hasAutoscaleCluster,
    totalDesiredComputeNodes,
    totalActualNodes,
    limitedSupport: cluster?.status?.limited_support_reason_count > 0,
    machinePools,
  };
};

export default connect(mapStateToProps, null)(DetailsRight);
