import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { connectRouter } from 'connected-react-router';
import { notifications } from '@redhat-cloud-services/frontend-components-notifications';

import { clustersReducer } from './clustersReducer';
import { clusterLogReducer } from '../../components/clusters/ClusterDetails/components/ClusterLogs/clusterLogReducer';
import { deleteClusterDialogReducer } from '../../components/clusters/common/DeleteClusterDialog/DeleteClusterDialogReducer';
import { viewOptionsReducer } from './viewOptionsReducer';
import userReducer from './userReducer';
import tollboothReducer from './tollbooth';
import { dashboardsReducer } from './dashboardsReducer';
import { cloudProvidersReducer } from './cloudProvidersReducer';
import modalReducer from '../../components/common/Modal/ModalReducer';
import { InstallationLogReducer } from '../../components/clusters/ClusterDetails/components/Overview/InstallationLogView/InstallationLogReducer';
import { IdentityProvidersReducer } from '../../components/clusters/ClusterDetails/components/IdentityProvidersModal/IdentityProvidersReducer';
import NetworkSelfServiceReducer from '../../components/clusters/ClusterDetails/components/AccessControl/NetworkSelfServiceSection/NetworkSelfServiceReducer';
import { MonitoringReducer } from '../../components/clusters/ClusterDetails/components/Monitoring/MonitoringReducer';
import clusterUsersReducer from '../../components/clusters/ClusterDetails/components/AccessControl/UsersSection/UsersReducer';
import addOnsReducer from '../../components/clusters/ClusterDetails/components/AddOns/AddOnsReducer';
import globalErrorReducer from './globalErrorReducer';
import machineTypesReducer from './machineTypesReducer';
import insightsReducer from '../../components/clusters/ClusterDetails/components/Insights/InsightsReducer';
import { subscriptionsReducer } from './subscriptionsReducer';
import { loadBalancersReducer } from './loadBalancersReducer';
import { persistentStorageReducer } from './persistentStorageReducer';
import { subscriptionSettingsReducer } from './subscriptionSettingsReducer';
import { subscriptionReleasedReducer } from '../../components/clusters/common/TransferClusterOwnershipDialog/subscriptionReleasedReducer';
import { NetworkingReducer } from '../../components/clusters/ClusterDetails/components/Networking/NetworkingReducer';
import supportStatusReducer from '../../components/clusters/ClusterDetails/components/Overview/SupportStatusLabel/supportStatusReducer';

const reducers = {
  clusters: clustersReducer,
  deleteCluster: deleteClusterDialogReducer,
  cloudProviders: cloudProvidersReducer,
  viewOptions: viewOptionsReducer,
  userProfile: userReducer,
  form: formReducer,
  tollbooth: tollboothReducer,
  modal: modalReducer,
  logs: InstallationLogReducer,
  identityProviders: IdentityProvidersReducer,
  clusterUsers: clusterUsersReducer,
  addOns: addOnsReducer,
  globalError: globalErrorReducer,
  machineTypes: machineTypesReducer,
  monitoring: MonitoringReducer,
  subscriptions: subscriptionsReducer,
  persistentStorageValues: persistentStorageReducer,
  loadBalancerValues: loadBalancersReducer,
  clusterLogs: clusterLogReducer,
  notifications,
  networkSelfService: NetworkSelfServiceReducer,
  subscriptionSettings: subscriptionSettingsReducer,
  subscriptionReleased: subscriptionReleasedReducer,
  insightsData: insightsReducer,
  clusterRouters: NetworkingReducer,
  dashboards: dashboardsReducer,
  supportStatus: supportStatusReducer,
};

const reduxReducers = history => combineReducers({
  ...reducers,
  router: connectRouter(history),
});

export { reduxReducers, reducers };

export default reduxReducers;
