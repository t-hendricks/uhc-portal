import { logsConstants } from './LogWindowConstants';
import { clusterService } from '../../../../../services';

const getLogs = clusterID => ({
  type: logsConstants.GET_LOGS,
  payload: clusterService.getLogs(clusterID),
});

const logsActions = {
  getLogs,
};

export {
  logsActions,
  getLogs,
};
