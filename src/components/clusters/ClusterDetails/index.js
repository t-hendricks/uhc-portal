import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';

import { push } from 'connected-react-router';

import ClusterDetails from './ClusterDetails';
import { fetchClusterDetails, invalidateClusters } from '../../../redux/actions/clustersActions';

import {
  getClusterIdentityProviders,
  resetIdentityProvidersState,
} from './components/IdentityProvidersModal/IdentityProvidersActions';
import usersActions from './components/AccessControl/UsersSection/UsersActions';
import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';
import { clearGlobalError, setGlobalError } from '../../../redux/actions/globalErrorActions';
import { userActions } from '../../../redux/actions';
import { modalActions } from '../../common/Modal/ModalActions';
import {
  getAlerts,
  getClusterOperators,
  getNodes,
} from './components/Monitoring/MonitoringActions';
import { getAddOns, getClusterAddOns } from './components/AddOns/AddOnsActions';
import { getGrants } from './components/AccessControl/NetworkSelfServiceSection/NetworkSelfServiceActions';
import { clusterLogActions, getClusterHistory } from './components/ClusterLogs/clusterLogActions';
import { getClusterRouters } from './components/Networking/NetworkingActions';
import { getSchedules } from '../common/Upgrades/clusterUpgradeActions';
import { viewConstants } from '../../../redux/constants';
import {
  disableRuleInsights,
  enableRuleInsights,
  fetchClusterInsights,
  fetchGroups,
  voteOnRuleInsights,
} from './components/Insights/InsightsActions';
import { getMachinePools, clearGetMachinePoolsResponse } from './components/MachinePools/MachinePoolsActions';
import canAllowAdminSelector from '../common/ToggleClusterAdminAccessDialog/ClusterAdminSelectors';
import canSubscribeOCPSelector
  from '../common/EditSubscriptionSettingsDialog/CanSubscribeOCPSelector';
import { canTransferClusterOwnershipSelector } from '../common/TransferClusterOwnershipDialog/TransferClusterOwnershipDialogSelectors';
import { issuesAndWarningsSelector } from './components/Monitoring/MonitoringSelectors';
import issuesCountSelector from './components/Insights/InsightsSelectors';
import { toggleSubscriptionReleased } from '../common/TransferClusterOwnershipDialog/subscriptionReleasedActions';
import getBaseName from '../../../common/getBaseName';
import { SUPPORT_TAB_FEATURE, OSD_UPGRADES_FEATURE, ASSISTED_INSTALLER_FEATURE } from '../../../redux/constants/featureConstants';
import supportActions from './components/Support/SupportActions';

const mapStateToProps = (state, { location }) => {
  const { details } = state.clusters;
  const { cloudProviders } = state;
  const { errorCode } = state.clusterLogs.requestState;
  const { addOns, clusterAddOns } = state.addOns;
  const { clusterIdentityProviders } = state.identityProviders;
  const { organization } = state.userProfile;
  const { insightsData, groups } = state.insightsData;
  const logsPresent = state.clusterLogs.clusterLogInitialized
    === state.clusterLogs.externalClusterID;
  const hideClusterLogs = !logsPresent || errorCode === 403 || errorCode === 404;
  const supportTabFeature = state.features[SUPPORT_TAB_FEATURE];
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
    clusterAddOns,
    clusterIdentityProviders,
    organization,
    displayClusterLogs: !hideClusterLogs,
    clusterLogsViewOptions: state.viewOptions[viewConstants.CLUSTER_LOGS_VIEW],
    insightsData,
    groups,
    canAllowClusterAdmin: canAllowAdminSelector(state),
    canSubscribeOCP: canSubscribeOCPSelector(state),
    canTransferClusterOwnership: canTransferClusterOwnershipSelector(state),
    anyModalOpen: !!state.modal.modalName,
    hasIssues: issuesAndWarningsSelector(state).issues.totalCount > 0,
    // check whether there are Critical (4) or Important (3) issues
    hasIssuesInsights: insightsIssuesCount[4] || insightsIssuesCount[3],
    initTabOpen: location.hash.replace('#', ''),
    supportTabFeature,
    notificationContacts,
    supportCases,
    upgradesEnabled: state.features[OSD_UPGRADES_FEATURE],
    assistedInstallerEnabled: state.features[ASSISTED_INSTALLER_FEATURE],
  });
};

const mapDispatchToProps = (dispatch, { location }) => bindActionCreators({
  fetchDetails: clusterId => fetchClusterDetails(clusterId),
  fetchInsightsData: (clusterId, isOSD) => fetchClusterInsights(clusterId, isOSD),
  fetchGroups,
  voteOnRule: (clusterId, ruleId, vote) => voteOnRuleInsights(clusterId, ruleId, vote),
  disableRule: (clusterId, ruleId) => disableRuleInsights(clusterId, ruleId),
  enableRule: (clusterId, ruleId) => enableRuleInsights(clusterId, ruleId),
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
  getAlerts,
  getNodes,
  getClusterOperators,
  getAddOns,
  getClusterAddOns,
  getGrants,
  getClusterRouters,
  getMachinePools,
  clearGetMachinePoolsResponse,
  setOpenedTab: tabKey => push(`${getBaseName()}${location.pathname}#${tabKey}`),
  getClusterHistory: (
    externalClusterID, queryObj,
  ) => getClusterHistory(externalClusterID, queryObj),
  toggleSubscriptionReleased,
  getNotificationContacts: supportActions.getNotificationContacts,
  getSupportCases: supportActions.getSupportCases,
  getSchedules,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ClusterDetails);
