import { SET_FEATURE } from '../constants/featureConstants';

const initialState = {};

const featuresReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FEATURE:
      return {
        ...state,
        [action.payload.feature]: action.payload.enabled,
      };
    default:
      return state;
  }
};

export default featuresReducer;
