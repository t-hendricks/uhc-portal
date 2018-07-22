import items from './ducks/items';
import userProfile from './ducks/users';
import { combineReducers } from 'redux';

const reducers = combineReducers({
  items,
  userProfile
});

export default reducers;
