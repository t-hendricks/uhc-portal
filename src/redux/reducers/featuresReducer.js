import { SET_FEATURE } from '../constants/featureConstants';
import { features } from '../actions/featureActions';

const initialState = {};
features.forEach((f) => {
  initialState[f.name] = false;
});

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
