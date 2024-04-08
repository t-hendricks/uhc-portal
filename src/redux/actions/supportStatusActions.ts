import { action, ActionType } from 'typesafe-actions';
import getOCPLifeCycleStatus from '~/services/productLifeCycleService';
import GET_SUPPORT_STATUS from '../constants/supportStatusConstants';

const getSupportStatus = () => action(GET_SUPPORT_STATUS, getOCPLifeCycleStatus());

const supportStatusActions = {
  getSupportStatus,
};

type SupportStatusAction = ActionType<typeof supportStatusActions>;

export { getSupportStatus, SupportStatusAction, supportStatusActions };
