import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { clustersReducer } from './clustersReducer';
import { clusterReducer } from '../../components/cluster/ClusterReducer';
import { viewOptionsReducer } from './viewOptionsReducer';
import userReducer from './userReducer';
import tollboothReducer from './tollbooth';
import { cloudProvidersReducer } from './cloudProvidersReducer';

const reducers = {
  clusters: clustersReducer,
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
