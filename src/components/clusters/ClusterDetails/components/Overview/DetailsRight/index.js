import { connect } from 'react-redux';
import nodesSectionDataSelector from './DetailsRightSelectors';
import DetailsRight from './DetailsRight';

const mapStateToProps = (state, ownProps) => {
  const nodesSectionData = nodesSectionDataSelector(state, ownProps.cluster);

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
  return { autoscaleEnabled: hasMachinePoolWithAutoscaling, totalDesiredComputeNodes };
};

export default connect(mapStateToProps, null)(DetailsRight);
