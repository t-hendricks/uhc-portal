import { clusterService } from '../../../../../../services';

import { installationLogConstants } from './InstallationLogConstants';

const getLogs =
  (clusterID, offset = 0, logType = 'install') =>
  (dispatch) =>
    dispatch({
      type: installationLogConstants.GET_LOGS,
      payload: clusterService
        .getLogs(clusterID, offset, logType)
        .then((response) => ({ ...response, logType })),
    });

const clearLogs = () => (dispatch) =>
  dispatch({
    type: installationLogConstants.CLEAR_LOGS,
  });

const installationLogActions = {
  getLogs,
  clearLogs,
};

export { installationLogActions, getLogs, clearLogs };
