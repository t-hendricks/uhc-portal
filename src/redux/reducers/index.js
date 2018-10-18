import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { clusterReducer } from './clusterReducer';
import { viewOptionsReducer } from './viewOptionsReducer';
import userReducer from './userReducer';
import installClusterReducer from './installClusterReducer';

const reducers = {
  cluster: clusterReducer,
  viewOptions: viewOptionsReducer,
  userProfile: userReducer,
  form: formReducer,
  installCluster: installClusterReducer,
};

const reduxReducers = combineReducers(reducers);

export { reduxReducers, reducers };

export default reduxReducers;
