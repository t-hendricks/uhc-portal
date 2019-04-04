import { logsConstants } from './LogWindowConstants';
import { clusterService } from '../../../../../services';

const getLogs = clusterID => ({
  type: logsConstants.GET_LOGS,
  payload: clusterService.getLogs(clusterID),
});

const clearLogs = () => ({
  type: logsConstants.CLEAR_LOGS,
});

const logsActions = {
  getLogs,
  clearLogs,
};

export {
  logsActions,
  getLogs,
  clearLogs,
};
