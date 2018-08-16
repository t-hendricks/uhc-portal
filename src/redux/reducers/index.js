import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

// new
import clusterReducer from './clusterReducer';
import viewOptionsReducer from './viewOptionsReducer';

// Old
import userProfile from '../../apis/users';
import clusterDetails from './clusterDetails';
import clusterListFilters from './clusterListFilter';
import createCluster from './createCluster';

const reducers = {
  // new
  cluster: clusterReducer,
  viewOptions: viewOptionsReducer,

  // old
  userProfile,
  clusterDetails,
  createCluster,
  form: formReducer,
  clusterListFilters,
};

const reduxReducers = combineReducers(reducers);

export { reduxReducers, reducers };

export default reduxReducers;
