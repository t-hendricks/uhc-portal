import clusterList from './ducks/clusterlist';
import userProfile from './ducks/users';
import clusterDetails from './ducks/clusterdetails';
import { combineReducers } from 'redux';

const reducers = combineReducers({
  clusterList,
  userProfile,
  clusterDetails
});

export default reducers;
