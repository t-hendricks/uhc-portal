import { action, ActionType } from 'typesafe-actions';
import { SET_GLOBAL_ERROR, CLEAR_GLOBAL_ERROR } from '../constants/globalErrorConstants';

const setGlobalError = (errorTitle: string, sourceComponent: string, errorMessage: string) =>
  action(SET_GLOBAL_ERROR, { errorTitle, errorMessage, sourceComponent });

/** If component is specified, clear only errors from that component, otherwise any error. */
const clearGlobalError = (requestingComponent?: string) =>
  action(CLEAR_GLOBAL_ERROR, requestingComponent);

const actions = {
  setGlobalError,
  clearGlobalError,
};

type GlobalErrorAction = ActionType<typeof actions>;

export { setGlobalError, clearGlobalError, GlobalErrorAction };
