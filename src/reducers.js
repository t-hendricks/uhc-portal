import { combineReducers } from 'redux';
import clusterList from './ducks/clusterlist';
import userProfile from './ducks/users';
import clusterDetails from './ducks/clusterdetails';

const reducers = combineReducers({
  clusterList,
  userProfile,
  clusterDetails,
});

export default reducers;
