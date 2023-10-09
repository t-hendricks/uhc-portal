import { clusterLogConstants } from '../../../../../redux/constants';
import serviceLogService from '../../../../../services/serviceLogService';
import { createServiceLogQueryObject } from '../../../../../common/queryHelpers';

const getClusterHistory = (externalClusterID, clusterID, params) => (dispatch) =>
  dispatch({
    type: clusterLogConstants.GET_CLUSTER_LOGS,
    payload: serviceLogService
      .getClusterHistory(externalClusterID, clusterID, createServiceLogQueryObject(params))
      .then((response) => ({
        externalClusterID,
        logs: response,
      })),
  });

const resetClusterHistory = () => (dispatch) =>
  dispatch({
    type: clusterLogConstants.RESET_CLUSTER_HISTORY,
  });

const clusterLogActions = {
  getClusterHistory,
  resetClusterHistory,
};

export { clusterLogActions, getClusterHistory, resetClusterHistory };
