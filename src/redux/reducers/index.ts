import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { connectRouter } from 'connected-react-router';

// TODO remove ignore statement once frontend-components-notifications has types
// @ts-ignore
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import rosaReducer from './rosaReducer';
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
import clustersSupportReducer from '../../components/clusters/ClusterDetails/components/Support/SupportReducer';
import addOnsReducer from '../../components/clusters/ClusterDetails/components/AddOns/AddOnsReducer';
import globalErrorReducer from './globalErrorReducer';
import flavoursReducer from './flavoursReducer';
import machineTypesReducer from './machineTypesReducer';
import dnsDomainsReducer from './dnsDomainsReducer';
import insightsReducer from '../../components/clusters/ClusterDetails/components/Insights/InsightsReducer';
import { clusterAutoscalerReducer } from './clusterAutoscalerReducer';
import { subscriptionsReducer } from './subscriptionsReducer';
import { loadBalancersReducer } from './loadBalancersReducer';
import { persistentStorageReducer } from './persistentStorageReducer';
import { subscriptionSettingsReducer } from './subscriptionSettingsReducer';
import { subscriptionReleasedReducer } from '../../components/clusters/common/TransferClusterOwnershipDialog/subscriptionReleasedReducer';
import { NetworkingReducer } from '../../components/clusters/ClusterDetails/components/Networking/NetworkingReducer';
import entitlementConfigReducer from './entitlementConfigReducer';
import clusterUpgrades from '../../components/clusters/common/Upgrades/clusterUpgradeReducer';
import machinePools from '../../components/clusters/ClusterDetails/components/MachinePools/MachinePoolsReducer';
import githubReducer from './githubReducer';
import ccsInquiriesReducer from './ccsInquiriesReducer';
import ocmRolesReducer from './OCMRolesReducer';
import supportStatusReducer from './supportStatusReducer';

import featuresReducer from './featuresReducer';
import apiErrorReducer from '../../components/App/ApiError/ApiErrorReducer';

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
  clusterAutoscaler: clusterAutoscalerReducer,
  clusterUsers: clusterUsersReducer,
  clusterSupport: clustersSupportReducer,
  dnsDomains: dnsDomainsReducer,
  addOns: addOnsReducer,
  globalError: globalErrorReducer,
  flavours: flavoursReducer,
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

const reduxReducers = (history: Parameters<typeof connectRouter>[0]) =>
  combineReducers({
    ...reducers,
    router: connectRouter(history),
  });

export { reduxReducers, reducers };

export default reduxReducers;
