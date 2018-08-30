import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

// new
import clusterReducer from './clusterReducer';
import viewOptionsReducer from './viewOptionsReducer';
import userReducer from './userReducer';

// Old
import createCluster from './createCluster';

const reducers = {
  // new
  cluster: clusterReducer,
  viewOptions: viewOptionsReducer,
  userProfile: userReducer,

  // old
  createCluster,
  form: formReducer,
};

const reduxReducers = combineReducers(reducers);

export { reduxReducers, reducers };

export default reduxReducers;
