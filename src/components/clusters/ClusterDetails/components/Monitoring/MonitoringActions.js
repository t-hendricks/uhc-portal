import { monitoringConstants } from './MonitoringConstants';
import { clusterService } from '../../../../../services';

const getAlerts = clusterID => dispatch => dispatch({
  type: monitoringConstants.GET_ALERTS,
  payload: clusterService.getAlerts(clusterID),
});

const getNodes = clusterID => dispatch => dispatch({
  type: monitoringConstants.GET_NODES,
  payload: clusterService.getNodes(clusterID),
});

const getClusterOperators = clusterID => dispatch => dispatch({
  type: monitoringConstants.GET_OPERATORS,
  payload: clusterService.getClusterOperators(clusterID),
});

const clearMonitoringState = () => dispatch => dispatch({
  type: monitoringConstants.CLEAR_MONITORING_STATE,
});

const MoniotoringActions = {
  getAlerts,
  getNodes,
  clearMonitoringState,
};

export {
  MoniotoringActions,
  getAlerts,
  getNodes,
  getClusterOperators,
  clearMonitoringState,
};
