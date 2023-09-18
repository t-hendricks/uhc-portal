import { connect } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import {
  getClusterStatus,
  getInflightChecks,
} from '../../../../../../redux/actions/clustersActions';
import ClusterStatusMonitor from './ClusterStatusMonitor';

const mapStateToProps = (state) => ({
  status: state.clusters.clusterStatus,
  inflightChecks: state.clusters.inflightChecks,
});

const mapDispatchToProps = (dispatch) => ({
  getClusterStatus: (clusterID) => dispatch(getClusterStatus(clusterID)),
  getInflightChecks: (clusterID) => dispatch(getInflightChecks(clusterID)),
  addNotification: (data) => dispatch(addNotification(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClusterStatusMonitor);
