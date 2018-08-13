import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import clusterList from './ducks/clusterlist';
import userProfile from './ducks/users';
import clusterDetails from './reducers/clusterDetails';
import clusterListFilters from './reducers/clusterListFilter';
import createCluster from './reducers/createCluster';

const reducers = combineReducers({
  clusterList,
  userProfile,
  clusterDetails,
  createCluster,
  form: formReducer,
  clusterListFilters,
});

export default reducers;
