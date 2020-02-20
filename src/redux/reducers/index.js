import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { notifications } from '@redhat-cloud-services/frontend-components-notifications';

import { clustersReducer } from './clustersReducer';
import { deleteClusterDialogReducer } from '../../components/clusters/common/DeleteClusterDialog/DeleteClusterDialogReducer';
import { viewOptionsReducer } from './viewOptionsReducer';
import userReducer from './userReducer';
import tollboothReducer from './tollbooth';
import { cloudProvidersReducer } from './cloudProvidersReducer';
import modalReducer from '../../components/common/Modal/ModalReducer';
import { LogsReducer } from '../../components/clusters/ClusterDetails/components/LogWindow/LogWindowReducer';
import { IdentityProvidersReducer } from '../../components/clusters/ClusterDetails/components/IdentityProvidersModal/IdentityProvidersReducer';
import NetworkSelfServiceReducer from '../../components/clusters/ClusterDetails/components/AccessControl/NetworkSelfServiceSection/NetworkSelfServiceReducer';
import { MonitoringReducer } from '../../components/clusters/ClusterDetails/components/Monitoring/MonitoringReducer';
import clusterUsersReducer from '../../components/clusters/ClusterDetails/components/AccessControl/UsersSection/UsersReducer';
import addOnsReducer from '../../components/clusters/ClusterDetails/components/AddOns/AddOnsReducer';
import globalErrorReducer from './globalErrorReducer';
import machineTypesReducer from './machineTypesReducer';
import { subscriptionsReducer } from './subscriptionsReducer';
import { loadBalancersReducer } from './loadBalancersReducer';
import { persistentStorageReducer } from './persistentStorageReducer';

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
  addOns: addOnsReducer,
  globalError: globalErrorReducer,
  machineTypes: machineTypesReducer,
  monitoring: MonitoringReducer,
  subscriptions: subscriptionsReducer,
  persistentStorageValues: persistentStorageReducer,
  loadBalancerValues: loadBalancersReducer,
  notifications,
  networkSelfService: NetworkSelfServiceReducer,
};

const reduxReducers = combineReducers(reducers);

export { reduxReducers, reducers };

export default reduxReducers;
