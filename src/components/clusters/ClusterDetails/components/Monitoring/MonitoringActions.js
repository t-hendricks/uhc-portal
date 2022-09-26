import monitoringConstants from './MonitoringConstants';
import { accountsService } from '../../../../../services';

const getOnDemandMetrics = (subscriptionID) => (dispatch) =>
  dispatch({
    type: monitoringConstants.GET_ONDEMAND_METRICS,
    payload: accountsService.getOnDemandMetrics(subscriptionID),
  });

const clearMonitoringState = () => (dispatch) =>
  dispatch({
    type: monitoringConstants.CLEAR_MONITORING_STATE,
  });

export { getOnDemandMetrics, clearMonitoringState };
