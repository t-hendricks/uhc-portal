import { connect } from 'react-redux';
import { resetClusterRouters } from './NetworkingActions';
import Networking from './Networking';

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const network = cluster.network || {};

  return ({ network });
};

const mapDispatchToProps = dispatch => ({
  resetRouters: () => dispatch(resetClusterRouters()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Networking);
