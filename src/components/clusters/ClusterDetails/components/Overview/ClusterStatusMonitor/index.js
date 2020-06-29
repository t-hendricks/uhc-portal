
import { connect } from 'react-redux';
import { getClusterStatus } from '../../../../../../redux/actions/clustersActions';
import ClusterStatusMonitor from './ClusterStatusMonitor';

const mapStateToProps = state => ({
  status: state.clusters.clusterStatus,
});

const mapDispatchToProps = {
  getClusterStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterStatusMonitor);
