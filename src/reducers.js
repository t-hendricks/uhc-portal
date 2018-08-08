import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import clusterList from './ducks/clusterlist';
import userProfile from './ducks/users';
import clusterDetails from './ducks/clusterdetails';
import createCluster from './ducks/createcluster';

const reducers = combineReducers({
  clusterList,
  userProfile,
  clusterDetails,
  createCluster,
  form: formReducer,
});

export default reducers;
