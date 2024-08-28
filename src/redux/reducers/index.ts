import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

// TODO remove ignore statement once frontend-components-notifications has types
// @ts-ignore
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';

import apiErrorReducer from '../../components/App/ApiError/ApiErrorReducer';
import NetworkSelfServiceReducer from '../../components/clusters/ClusterDetails/components/AccessControl/NetworkSelfServiceSection/NetworkSelfServiceReducer';
import clusterUsersReducer from '../../components/clusters/ClusterDetails/components/AccessControl/UsersSection/UsersReducer';
import addOnsReducer from '../../components/clusters/ClusterDetails/components/AddOns/AddOnsReducer';
import { clusterLogReducer } from '../../components/clusters/ClusterDetails/components/ClusterLogs/clusterLogReducer';
import { IdentityProvidersReducer } from '../../components/clusters/ClusterDetails/components/IdentityProvidersPage/IdentityProvidersReducer';
import insightsReducer from '../../components/clusters/ClusterDetails/components/Insights/InsightsReducer';
import machinePools from '../../components/clusters/ClusterDetails/components/MachinePools/MachinePoolsReducer';
import { MonitoringReducer } from '../../components/clusters/ClusterDetails/components/Monitoring/MonitoringReducer';
import { NetworkingReducer } from '../../components/clusters/ClusterDetails/components/Networking/NetworkingReducer';
import { deleteProtectionReducer } from '../../components/clusters/ClusterDetails/components/Overview/DetailsRight/DeleteProtection/deleteProtectionReducer';
import { InstallationLogReducer } from '../../components/clusters/ClusterDetails/components/Overview/InstallationLogView/InstallationLogReducer';
import { deleteClusterDialogReducer } from '../../components/clusters/common/DeleteClusterDialog/DeleteClusterDialogReducer';
import clusterUpgrades from '../../components/clusters/common/Upgrades/clusterUpgradeReducer';
import modalReducer from '../../components/common/Modal/ModalReducer';

import { accessProtectionReducer } from './accessProtectionReducer';
import { accessRequestReducer } from './accessRequestReducer';
import ccsInquiriesReducer from './ccsInquiriesReducer';
import { cloudProvidersReducer } from './cloudProvidersReducer';
import { clusterAutoscalerReducer } from './clusterAutoscalerReducer';
import { clustersReducer } from './clustersReducer';
import { costReducer } from './costReducer';
import { dashboardsReducer } from './dashboardsReducer';
import dnsDomainsReducer from './dnsDomainsReducer';
import entitlementConfigReducer from './entitlementConfigReducer';
import featuresReducer from './featuresReducer';
import flavoursReducer from './flavoursReducer';
import githubReducer from './githubReducer';
import globalErrorReducer from './globalErrorReducer';
import { loadBalancersReducer } from './loadBalancersReducer';
import machineTypesByRegionReducer from './machineTypesByRegionReducer';
import machineTypesReducer from './machineTypesReducer';
import ocmRolesReducer from './OCMRolesReducer';
import { persistentStorageReducer } from './persistentStorageReducer';
import rosaReducer from './rosaReducer';
import { subscriptionReleasedReducer } from './subscriptionReleasedReducer';
import { subscriptionSettingsReducer } from './subscriptionSettingsReducer';
import { subscriptionsReducer } from './subscriptionsReducer';
import { supportReducer } from './supportReducer';
import supportStatusReducer from './supportStatusReducer';
import tollboothReducer from './tollbooth';
import userReducer from './userReducer';
import { viewOptionsReducer } from './viewOptionsReducer';

const reducers = {
  accessRequest: accessRequestReducer,
  accessProtection: accessProtectionReducer,
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
  clusterSupport: supportReducer,
  dnsDomains: dnsDomainsReducer,
  addOns: addOnsReducer,
  globalError: globalErrorReducer,
  flavours: flavoursReducer,
  machineTypes: machineTypesReducer,
  machineTypesByRegion: machineTypesByRegionReducer,
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
  deleteProtection: deleteProtectionReducer,
};

const reduxReducers = combineReducers({
  ...reducers,
});

export { reducers, reduxReducers };

export default reduxReducers;
