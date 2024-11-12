import { connect } from 'react-redux';

import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

import {
  clearInflightChecks,
  getClusterStatus,
  getInflightChecks,
  getRerunInflightChecks,
  rerunInflightChecks,
} from '~/redux/actions/clustersActions';

import ClusterStatusMonitor from './ClusterStatusMonitor';

const mapStateToProps = (state) => ({
  status: state.clusters.clusterStatus,
  inflightChecks: state.clusters.inflightChecks,
  rerunInflightCheckReq: state.clusters.rerunInflightCheckReq,
  rerunInflightCheckRes: state.clusters.rerunInflightCheckRes,
});

const mapDispatchToProps = (dispatch) => ({
  getClusterStatus: (clusterID) => dispatch(getClusterStatus(clusterID)),
  getInflightChecks: (clusterID) => dispatch(getInflightChecks(clusterID)),
  rerunInflightChecks: (clusterID) => dispatch(rerunInflightChecks(clusterID)),
  resetInflightChecks: () => dispatch(clearInflightChecks()),
  getRerunInflightChecks: (subnetIds) => dispatch(getRerunInflightChecks(subnetIds)),
  addNotification: (data) => dispatch(addNotification(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClusterStatusMonitor);
