import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { clustersReducer } from './clustersReducer';
import { deleteClusterDialogReducer } from '../../components/clusters/common/DeleteClusterDialog/DeleteClusterDialogReducer';
import { viewOptionsReducer } from './viewOptionsReducer';
import userReducer from './userReducer';
import tollboothReducer from './tollbooth';
import { cloudProvidersReducer } from './cloudProvidersReducer';
import modalReducer from '../../components/common/Modal/ModalReducer';

const reducers = {
  clusters: clustersReducer,
  deleteCluster: deleteClusterDialogReducer,
  cloudProviders: cloudProvidersReducer,
  viewOptions: viewOptionsReducer,
  userProfile: userReducer,
  form: formReducer,
  tollbooth: tollboothReducer,
  modal: modalReducer,
};

const reduxReducers = combineReducers(reducers);

export { reduxReducers, reducers };

export default reduxReducers;
