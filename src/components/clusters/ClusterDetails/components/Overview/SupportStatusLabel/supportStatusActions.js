import GET_SUPPORT_STATUS from './supportStatusConstants';
import getOCPLifeCycleStatus from '../../../../../../services/productLifeCycleService';

const getSupportStatus = () => (dispatch) =>
  dispatch({
    type: GET_SUPPORT_STATUS,
    payload: getOCPLifeCycleStatus(),
  });

export default getSupportStatus;
