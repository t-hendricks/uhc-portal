import { clusterLogConstants } from '../../../../../redux/constants';
import serviceLogService from '../../../../../services/serviceLogService';
import { createServiceLogQueryObject } from '../../../../../common/queryHelpers';

const getClusterHistory = (externalClusterID, params) => (dispatch) =>
  dispatch({
    type: clusterLogConstants.GET_CLUSTER_LOGS,
    payload: serviceLogService
      .getClusterHistory(externalClusterID, createServiceLogQueryObject(params))
      .then((response) => ({
        externalClusterID,
        logs: response,
      })),
  });

const downloadClusterLogs =
  (externalClusterID, params, format = 'csv') =>
  (dispatch) =>
    dispatch({
      type: clusterLogConstants.DOWNLOAD_CLUSTER_LOGS,
      payload: serviceLogService
        .getClusterHistory(externalClusterID, {
          ...createServiceLogQueryObject(params),
          format,
        })
        .then((response) => ({
          format,
          response,
        })),
    });

const resetClusterHistory = () => (dispatch) =>
  dispatch({
    type: clusterLogConstants.RESET_CLUSTER_HISTORY,
  });

const clusterLogActions = {
  getClusterHistory,
  downloadClusterLogs,
  resetClusterHistory,
};

export { clusterLogActions, getClusterHistory, downloadClusterLogs, resetClusterHistory };
