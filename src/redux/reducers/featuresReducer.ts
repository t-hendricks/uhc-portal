import { SET_FEATURE } from '../constants/featureConstants';
import { FeatureAction, features } from '../actions/featureActions';

type State = {
  [feature: string]: boolean | undefined;
};

const initialState: State = {};
features.forEach((f) => {
  initialState[f.name] = false;
});

const featuresReducer = (state = initialState, action: FeatureAction): State => {
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
