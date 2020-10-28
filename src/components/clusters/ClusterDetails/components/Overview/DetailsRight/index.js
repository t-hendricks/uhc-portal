import { connect } from 'react-redux';
import get from 'lodash/get';

import DetailsRight from './DetailsRight';

const mapStateToProps = (state) => {
  let totalDesiredComputeNodes = get(state, 'clusters.details.cluster.nodes.compute', 0);

  state.machinePools.getMachinePools.data.forEach((machinePool) => {
    totalDesiredComputeNodes += machinePool.replicas;
  });

  return {
    totalDesiredComputeNodes,
  };
};


export default connect(mapStateToProps, null)(DetailsRight);
