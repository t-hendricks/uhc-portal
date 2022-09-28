import { connect } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { getClusterStatus } from '../../../../../../redux/actions/clustersActions';
import ClusterStatusMonitor from './ClusterStatusMonitor';

const mapStateToProps = (state) => ({
  status: state.clusters.clusterStatus,
});

const mapDispatchToProps = (dispatch) => ({
  getClusterStatus: (clusterID) => dispatch(getClusterStatus(clusterID)),
  addNotification: (data) => dispatch(addNotification(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClusterStatusMonitor);
