import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { clusterReducer } from './clusterReducer';
import { viewOptionsReducer } from './viewOptionsReducer';
import userReducer from './userReducer';
import tollboothReducer from './tollbooth';
import { cloudProvidersReducer } from './cloudProvidersReducer';

const reducers = {
  cluster: clusterReducer,
  cloudProviders: cloudProvidersReducer,
  viewOptions: viewOptionsReducer,
  userProfile: userReducer,
  form: formReducer,
  tollbooth: tollboothReducer,
};

const reduxReducers = combineReducers(reducers);

export { reduxReducers, reducers };

export default reduxReducers;
