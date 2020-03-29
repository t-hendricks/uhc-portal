import { clusterLogConstants } from '../../../../../redux/constants';
import serviceLogService from '../../../../../services/serviceLogService';
import { createServiceLogQueryObject } from '../../../../../common/queryHelpers';

const getClusterHistory = (externalClusterID, params) => dispatch => dispatch({
  type: clusterLogConstants.GET_CLUSTER_LOGS,
  payload: serviceLogService.getClusterHistory(
    createServiceLogQueryObject(params, externalClusterID),
  )
    .then(
      response => ({
        externalClusterID,
        logs: response,
      }),
    ),
});

const downloadClusterLogs = (externalClusterID, params, format = 'csv') => dispatch => dispatch({
  type: clusterLogConstants.DOWNLOAD_CLUSTER_LOGS,
  payload: serviceLogService.getClusterHistory({
    ...createServiceLogQueryObject(params, externalClusterID),
    format,
  })
    .then(
      response => ({
        format,
        response,
      }),
    ),
});

const clusterLogActions = {
  getClusterHistory,
  downloadClusterLogs,
};

export {
  clusterLogActions, getClusterHistory, downloadClusterLogs,
};
