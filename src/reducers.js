import { combineReducers } from 'redux';
import clusterList from './ducks/clusterlist';
import userProfile from './ducks/users';
import clusterDetails from './ducks/clusterdetails';
import createCluster from './ducks/createcluster';

const reducers = combineReducers({
  clusterList,
  userProfile,
  clusterDetails,
  createCluster,
});

export default reducers;
