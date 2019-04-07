import { logWindowConstants } from './LogWindowConstants';
import { clusterService } from '../../../../../services';

const getLogs = clusterID => dispatch => dispatch({
  type: logWindowConstants.GET_LOGS,
  payload: clusterService.getLogs(clusterID),
});

const clearLogs = () => dispatch => dispatch({
  type: logWindowConstants.CLEAR_LOGS,
});

const logWindowActions = {
  getLogs,
  clearLogs,
};

export {
  logWindowActions,
  getLogs,
  clearLogs,
};
