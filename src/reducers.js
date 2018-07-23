import items from './ducks/items';
import userProfile from './ducks/users';
import clusterDetails from './ducks/clusterdetails';
import { combineReducers } from 'redux';

const reducers = combineReducers({
  items,
  userProfile,
  clusterDetails
});

export default reducers;
