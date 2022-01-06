import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { connectRouter } from 'connected-react-router';

import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { clustersReducer } from './clustersReducer';
import { clusterLogReducer } from '../../components/clusters/ClusterDetails/components/ClusterLogs/clusterLogReducer';
import { deleteClusterDialogReducer } from '../../components/clusters/common/DeleteClusterDialog/DeleteClusterDialogReducer';
import { viewOptionsReducer } from './viewOptionsReducer';
import userReducer from './userReducer';
import tollboothReducer from './tollbooth';
import { dashboardsReducer } from './dashboardsReducer';
import { cloudProvidersReducer } from './cloudProvidersReducer';
import { costReducer } from './costReducer';
import modalReducer from '../../components/common/Modal/ModalReducer';
import { InstallationLogReducer } from '../../components/clusters/ClusterDetails/components/Overview/InstallationLogView/InstallationLogReducer';
import { IdentityProvidersReducer } from '../../components/clusters/ClusterDetails/components/IdentityProvidersPage/IdentityProvidersReducer';
import NetworkSelfServiceReducer from '../../components/clusters/ClusterDetails/components/AccessControl/NetworkSelfServiceSection/NetworkSelfServiceReducer';
import { MonitoringReducer } from '../../components/clusters/ClusterDetails/components/Monitoring/MonitoringReducer';
import clusterUsersReducer from '../../components/clusters/ClusterDetails/components/AccessControl/UsersSection/UsersReducer';
import clustersSupportReducer
  from '../../components/clusters/ClusterDetails/components/Support/SupportReducer';
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
import entitlementConfigReducer from './entitlementConfigReducer';
import clusterUpgrades from '../../components/clusters/common/Upgrades/clusterUpgradeReducer';
import machinePools from '../../components/clusters/ClusterDetails/components/MachinePools/MachinePoolsReducer';
import githubReducer from './githubReducer';
import ccsInquiriesReducer from '../../components/clusters/CreateOSDPage/CreateOSDWizard/ccsInquiriesReducer';
import ocmRolesReducer from '../../components/clusters/ClusterDetails/components/AccessControl/OCMRolesSection/OCMRolesReducer';

import featuresReducer from './featuresReducer';
import apiErrorReducer from '../../components/App/ApiError/ApiErrorReducer';
import rosaReducer from '../../components/clusters/CreateROSAPage/CreateROSAWizard/rosaReducer';

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
  clusterSupport: clustersSupportReducer,
  addOns: addOnsReducer,
  globalError: globalErrorReducer,
  machineTypes: machineTypesReducer,
  monitoring: MonitoringReducer,
  subscriptions: subscriptionsReducer,
  persistentStorageValues: persistentStorageReducer,
  loadBalancerValues: loadBalancersReducer,
  clusterLogs: clusterLogReducer,
  notifications: notificationsReducer,
  networkSelfService: NetworkSelfServiceReducer,
  subscriptionSettings: subscriptionSettingsReducer,
  subscriptionReleased: subscriptionReleasedReducer,
  insightsData: insightsReducer,
  clusterRouters: NetworkingReducer,
  cost: costReducer,
  dashboards: dashboardsReducer,
  supportStatus: supportStatusReducer,
  entitlementConfig: entitlementConfigReducer,
  features: featuresReducer,
  clusterUpgrades,
  apiError: apiErrorReducer,
  machinePools,
  githubReleases: githubReducer,
  ccsInquiries: ccsInquiriesReducer,
  ocmRoles: ocmRolesReducer,
  rosaReducer,
};

const reduxReducers = history => combineReducers({
  ...reducers,
  router: connectRouter(history),
});

export { reduxReducers, reducers };

export default reduxReducers;
