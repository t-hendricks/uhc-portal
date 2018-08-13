import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import clusterList from './ducks/clusterlist';
import userProfile from './ducks/users';
import clusterDetails from './reducers/clusterDetails';
import createCluster from './ducks/createcluster';
import clusterListFilters from './reducers/clusterListFilter';

const reducers = combineReducers({
  clusterList,
  userProfile,
  clusterDetails,
  createCluster,
  form: formReducer,
  clusterListFilters,
});

export default reducers;
