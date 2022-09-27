import { SET_GLOBAL_ERROR, CLEAR_GLOBAL_ERROR } from '../constants/globalErrorConstants';

const setGlobalError = (errorTitle, sourceComponent, errorMessage) => (dispatch) => {
  dispatch({
    type: SET_GLOBAL_ERROR,
    payload: { errorTitle, errorMessage, sourceComponent },
  });
};

const clearGlobalError = (requestingComponent) => (dispatch) => {
  dispatch({
    type: CLEAR_GLOBAL_ERROR,
    payload: requestingComponent,
  });
};

export { setGlobalError, clearGlobalError };
