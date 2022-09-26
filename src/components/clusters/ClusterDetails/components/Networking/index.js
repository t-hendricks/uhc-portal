import { connect } from 'react-redux';
import get from 'lodash/get';
import { resetClusterRouters } from './NetworkingActions';
import Networking from './Networking';

const mapStateToProps = (state) => {
  const { clusterRouters } = state;
  const { cluster } = state.clusters.details;
  const network = cluster.network || {};
  const provider = get(cluster, 'cloud_provider.id', 'N/A');
  return {
    network,
    provider,
    gotRouters: get(clusterRouters, 'getRouters.routers.length', 0) > 0,
  };
};

const mapDispatchToProps = (dispatch) => ({
  resetRouters: () => dispatch(resetClusterRouters()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Networking);
