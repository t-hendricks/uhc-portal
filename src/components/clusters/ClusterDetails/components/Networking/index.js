import { connect } from 'react-redux';
import { resetClusterRouters } from './NetworkingActions';
import Networking from './Networking';

const mapStateToProps = (state) => {
  const { clusterRouters } = state;
  const { cluster } = state.clusters.details;
  const network = cluster.network || {};

  return ({
    network,
    gotRouters: clusterRouters.getRouters.routers.length > 0,
  });
};

const mapDispatchToProps = dispatch => ({
  resetRouters: () => dispatch(resetClusterRouters()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Networking);
