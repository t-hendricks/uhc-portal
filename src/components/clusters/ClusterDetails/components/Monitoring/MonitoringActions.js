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

const MoniotoringActions = {
  getAlerts,
  getNodes,
};

export {
  MoniotoringActions,
  getAlerts,
  getNodes,
};
