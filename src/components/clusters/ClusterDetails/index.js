import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';

import { push } from 'connected-react-router';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

import ClusterDetails from './ClusterDetails';
import { fetchClusterDetails, invalidateClusters } from '../../../redux/actions/clustersActions';

import {
  getClusterIdentityProviders,
  resetIdentityProvidersState,
} from './components/IdentityProvidersPage/IdentityProvidersActions';
import usersActions from './components/AccessControl/UsersSection/UsersActions';
import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';
import { clearGlobalError, setGlobalError } from '../../../redux/actions/globalErrorActions';
import { userActions } from '../../../redux/actions';
import { modalActions } from '../../common/Modal/ModalActions';
import { getOnDemandMetrics } from './components/Monitoring/MonitoringActions';
import { getAddOns, getClusterAddOns } from './components/AddOns/AddOnsActions';
import { getGrants } from './components/AccessControl/NetworkSelfServiceSection/NetworkSelfServiceActions';
import { clusterLogActions, getClusterHistory } from './components/ClusterLogs/clusterLogActions';
import { getClusterRouters } from './components/Networking/NetworkingActions';
import { getSchedules } from '../common/Upgrades/clusterUpgradeActions';
import { viewConstants } from '../../../redux/constants';
import { onClearFiltersAndFlags } from '~/redux/actions/viewOptionsActions';
import {
  fetchClusterInsights,
} from './components/Insights/InsightsActions';
import { getMachinePools, clearGetMachinePoolsResponse } from './components/MachinePools/MachinePoolsActions';
import canSubscribeOCPSelector from '../common/EditSubscriptionSettingsDialog/CanSubscribeOCPSelector';
import { canTransferClusterOwnershipSelector } from '../common/TransferClusterOwnershipDialog/TransferClusterOwnershipDialogSelectors';
import { issuesAndWarningsSelector } from './components/Monitoring/MonitoringSelectors';
import issuesCountSelector from './components/Insights/InsightsSelectors';
import canHibernateClusterSelector from '../common/HibernateClusterModal/HibernateClusterModalSelector';
import { toggleSubscriptionReleased } from '../common/TransferClusterOwnershipDialog/subscriptionReleasedActions';
import getBaseName from '../../../common/getBaseName';
import { ASSISTED_INSTALLER_FEATURE } from '../../../redux/constants/featureConstants';
import supportActions from './components/Support/SupportActions';
import { getUserAccess } from '../../../redux/actions/costActions';

import { getUpgradeGates } from '../common/Upgrades/UpgradeAcknowledge/UpgradeAcknowledgeSelectors';
import { fetchUpgradeGates } from '../../../redux/actions/upgradeGateActions';

const mapStateToProps = (state, { location }) => {
  const { details } = state.clusters;
  const { cloudProviders, clusterRouters } = state;
  const { errorCode } = state.clusterLogs.requestState;
  const { addOns } = state.addOns;
  const { clusterIdentityProviders } = state.identityProviders;
  const { organization } = state.userProfile;
  const { insightsData } = state.insightsData;
  const logsPresent = state.clusterLogs.clusterLogInitialized
    === state.clusterLogs.externalClusterID;
  const hideClusterLogs = !logsPresent || errorCode === 403 || errorCode === 404;
  const {
    notificationContacts = {
      pending: false,
    },
    supportCases = {
      pending: false,
    },
  } = state.clusterSupport;
  const clusterId = get(details, 'cluster.external_id');
  const insightsIssuesCount = issuesCountSelector(state, clusterId);

  return ({
    cloudProviders,
    clusterDetails: details,
    addOns,
    clusterIdentityProviders,
    organization,
    displayClusterLogs: !hideClusterLogs,
    clusterLogsViewOptions: state.viewOptions[viewConstants.CLUSTER_LOGS_VIEW],
    insightsData,
    canSubscribeOCP: canSubscribeOCPSelector(state),
    canTransferClusterOwnership: canTransferClusterOwnershipSelector(state),
    canHibernateCluster: canHibernateClusterSelector(state),
    anyModalOpen: !!state.modal.modalName,
    hasIssues: issuesAndWarningsSelector(state).issues.totalCount > 0,
    // check whether there are Critical (4) or Important (3) issues
    hasIssuesInsights: !!(insightsIssuesCount[4] || insightsIssuesCount[3]),
    initTabOpen: location.hash.replace('#', ''),
    notificationContacts,
    supportCases,
    assistedInstallerEnabled: state.features[ASSISTED_INSTALLER_FEATURE],
    userAccess: state.cost.userAccess,
    gotRouters: get(clusterRouters, 'getRouters.routers.length', 0) > 0,
    upgradeGates: getUpgradeGates(state),
  });
};

const mapDispatchToProps = (dispatch, { location }) => bindActionCreators({
  fetchDetails: fetchClusterDetails,
  fetchClusterInsights,
  getCloudProviders: cloudProviderActions.getCloudProviders,
  getOrganizationAndQuota: userActions.getOrganizationAndQuota,
  invalidateClusters,
  openModal: modalActions.openModal,
  closeModal: modalActions.closeModal,
  getClusterIdentityProviders,
  getUsers: usersActions.getUsers,
  resetIdentityProvidersState,
  resetClusterHistory: clusterLogActions.resetClusterHistory,
  clearGlobalError,
  setGlobalError,
  getOnDemandMetrics,
  getAddOns,
  getClusterAddOns,
  getGrants,
  getClusterRouters,
  getMachinePools,
  clearGetMachinePoolsResponse,
  setOpenedTab: tabKey => push(`${getBaseName()}${location.pathname}#${tabKey}`),
  getClusterHistory,
  toggleSubscriptionReleased,
  getNotificationContacts: supportActions.getNotificationContacts,
  getSupportCases: supportActions.getSupportCases,
  getSchedules,
  getUserAccess,
  addNotification,
  fetchUpgradeGates,
  clearFiltersAndFlags: () => onClearFiltersAndFlags(viewConstants.CLUSTER_LOGS_VIEW),
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ClusterDetails);
