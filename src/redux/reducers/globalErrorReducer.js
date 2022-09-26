import { SET_GLOBAL_ERROR, CLEAR_GLOBAL_ERROR } from '../constants/globalErrorConstants';

const initialState = {
  errorMessage: undefined,
  errorTitle: undefined,
  sourceComponent: undefined,
};

function globalErrorReducer(state = initialState, action) {
  switch (action.type) {
    case SET_GLOBAL_ERROR:
      return {
        errorMessage: action.payload.errorMessage,
        errorTitle: action.payload.errorTitle,
        sourceComponent: action.payload.sourceComponent,
      };
    case CLEAR_GLOBAL_ERROR:
      /*
      The "Clear" action suppots two modes - if requestingComponent is set, this is
      for calling when a component is mounted, so it'll only want to clear the error
      state if it is the one that set it in the first place.

      When requestingComponent is not set, clear the state uncodintionally - this is for
      allowing the user to close the error alert by clicking the X button.
      */
      if (
        !action.payload.requestingComponent ||
        action.payload.requestingComponent === state.sourceComponent
      ) {
        return initialState;
      }
      return state;
    default:
      return state;
  }
}

export default globalErrorReducer;
