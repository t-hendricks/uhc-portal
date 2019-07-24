import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { clustersReducer } from './clustersReducer';
import { deleteClusterDialogReducer } from '../../components/clusters/common/DeleteClusterDialog/DeleteClusterDialogReducer';
import { viewOptionsReducer } from './viewOptionsReducer';
import userReducer from './userReducer';
import tollboothReducer from './tollbooth';
import { cloudProvidersReducer } from './cloudProvidersReducer';
import modalReducer from '../../components/common/Modal/ModalReducer';
import { LogsReducer } from '../../components/clusters/ClusterDetails/components/LogWindow/LogWindowReducer';
import { IdentityProvidersReducer } from '../../components/clusters/ClusterDetails/components/IdentityProvidersModal/IdentityProvidersReducer';
import clusterUsersReducer from '../../components/clusters/ClusterDetails/components/Users/UsersReducer';
import globalErrorReducer from './globalErrorReducer';
import machineTypesReducer from './machineTypesReducer';

const reducers = {
  clusters: clustersReducer,
  deleteCluster: deleteClusterDialogReducer,
  cloudProviders: cloudProvidersReducer,
  viewOptions: viewOptionsReducer,
  userProfile: userReducer,
  form: formReducer,
  tollbooth: tollboothReducer,
  modal: modalReducer,
  logs: LogsReducer,
  identityProviders: IdentityProvidersReducer,
  clusterUsers: clusterUsersReducer,
  globalError: globalErrorReducer,
  machineTypes: machineTypesReducer,
};

const reduxReducers = combineReducers(reducers);

export { reduxReducers, reducers };

export default reduxReducers;
