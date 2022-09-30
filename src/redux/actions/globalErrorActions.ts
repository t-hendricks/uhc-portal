import { action, ActionType } from 'typesafe-actions';
import { SET_GLOBAL_ERROR, CLEAR_GLOBAL_ERROR } from '../constants/globalErrorConstants';
import type { AppThunk } from '../types';

const setGlobalErrorAction = (errorTitle: string, sourceComponent: string, errorMessage: string) =>
  action(SET_GLOBAL_ERROR, { errorTitle, errorMessage, sourceComponent });

const setGlobalError =
  (errorTitle: string, sourceComponent: string, errorMessage: string): AppThunk =>
  (dispatch) => {
    dispatch(setGlobalErrorAction(errorTitle, sourceComponent, errorMessage));
  };

const clearGlobalErrorAction = (requestingComponent: string) =>
  action(CLEAR_GLOBAL_ERROR, requestingComponent);

const clearGlobalError =
  (requestingComponent: string): AppThunk =>
  (dispatch) => {
    dispatch(clearGlobalErrorAction(requestingComponent));
  };

type GlobalErrorAction = ActionType<typeof setGlobalErrorAction | typeof clearGlobalErrorAction>;

export { setGlobalError, clearGlobalError, GlobalErrorAction };
