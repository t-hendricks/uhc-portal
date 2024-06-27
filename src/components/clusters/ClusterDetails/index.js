import get from 'lodash/get';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

import { featureGateSelector } from '~/hooks/useFeatureGate';
import { accessRequestActions } from '~/redux/actions/accessRequestActions';
import { clearListVpcs } from '~/redux/actions/ccsInquiriesActions';
import { clusterAutoscalerActions } from '~/redux/actions/clusterAutoscalerActions';
import { onClearFiltersAndFlags } from '~/redux/actions/viewOptionsActions';
import {
  ACCESS_REQUEST_ENABLED,
  ASSISTED_INSTALLER_FEATURE,
  HCP_USE_NODE_UPGRADE_POLICIES,
  NETWORK_VALIDATOR_ONDEMAND_FEATURE,
} from '~/redux/constants/featureConstants';

import { userActions } from '../../../redux/actions';
import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';
import { fetchClusterDetails, invalidateClusters } from '../../../redux/actions/clustersActions';
import { getUserAccess } from '../../../redux/actions/costActions';
import { clearGlobalError, setGlobalError } from '../../../redux/actions/globalErrorActions';
import { toggleSubscriptionReleased } from '../../../redux/actions/subscriptionReleasedActions';
import { getNotificationContacts, getSupportCases } from '../../../redux/actions/supportActions';
import { fetchUpgradeGates } from '../../../redux/actions/upgradeGateActions';
import { viewConstants } from '../../../redux/constants';
import { modalActions } from '../../common/Modal/ModalActions';
import canSubscribeOCPSelector from '../common/EditSubscriptionSettingsDialog/CanSubscribeOCPSelector';
import { userCanHibernateClustersSelector } from '../common/HibernateClusterModal/HibernateClusterModalSelectors';
import { canTransferClusterOwnershipSelector } from '../common/TransferClusterOwnershipDialog/utils/transferClusterOwnershipDialogSelectors';
import { getSchedules } from '../common/Upgrades/clusterUpgradeActions';
import { getUpgradeGates } from '../common/Upgrades/UpgradeAcknowledge/UpgradeAcknowledgeSelectors';

import { getGrants } from './components/AccessControl/NetworkSelfServiceSection/NetworkSelfServiceActions';
import usersActions from './components/AccessControl/UsersSection/UsersActions';
import { getAddOns, getClusterAddOns } from './components/AddOns/AddOnsActions';
import { clusterLogActions } from './components/ClusterLogs/clusterLogActions';
import {
  getClusterIdentityProviders,
  resetIdentityProvidersState,
} from './components/IdentityProvidersPage/IdentityProvidersActions';
import { fetchClusterInsights } from './components/Insights/InsightsActions';
import {
  clearGetMachinePoolsResponse,
  getMachineOrNodePools,
} from './components/MachinePools/MachinePoolsActions';
import { getOnDemandMetrics } from './components/Monitoring/MonitoringActions';
import { issuesAndWarningsSelector } from './components/Monitoring/MonitoringSelectors';
import { getClusterRouters } from './components/Networking/NetworkingActions';
import ClusterDetails from './ClusterDetails';

const mapStateToProps = (state, { location }) => {
  const { details } = state.clusters;
  const { cloudProviders, clusterRouters } = state;
  const { addOns } = state.addOns;
  const { clusterIdentityProviders } = state.identityProviders;
  const { organization } = state.userProfile;
  const { insightsData } = state.insightsData;
  const { logs } = state.clusterLogs;
  const {
    notificationContacts = {
      pending: false,
    },
    supportCases = {
      pending: false,
    },
  } = state.clusterSupport;
  const externalId = get(details, 'cluster.external_id');

  return {
    cloudProviders,
    clusterDetails: details,
    addOns,
    clusterIdentityProviders,
    organization,
    displayClusterLogs: !!externalId || !!details?.cluster?.id,
    clusterLogsViewOptions: state.viewOptions[viewConstants.CLUSTER_LOGS_VIEW],
    accessRequestsViewOptions: state.viewOptions[viewConstants.ACCESS_REQUESTS_VIEW],
    pendingAccessRequests: state.accessRequest.pendingAccessRequests,
    insightsData,
    logs,
    canSubscribeOCP: canSubscribeOCPSelector(state),
    canTransferClusterOwnership: canTransferClusterOwnershipSelector(state),
    canHibernateCluster: userCanHibernateClustersSelector(state),
    anyModalOpen: !!state.modal.modalName,
    hasIssues: issuesAndWarningsSelector(state).issues.totalCount > 0,
    initTabOpen: location.hash.replace('#', ''),
    notificationContacts,
    supportCases,
    assistedInstallerEnabled: featureGateSelector(state, ASSISTED_INSTALLER_FEATURE),
    userAccess: state.cost.userAccess,
    gotRouters: get(clusterRouters, 'getRouters.routers.length', 0) > 0,
    upgradeGates: getUpgradeGates(state),
    useNodeUpgradePolicies: featureGateSelector(state, HCP_USE_NODE_UPGRADE_POLICIES),
    hasNetworkOndemand: featureGateSelector(state, NETWORK_VALIDATOR_ONDEMAND_FEATURE),
    isAccessRequestEnabled: featureGateSelector(state, ACCESS_REQUEST_ENABLED),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
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
      resetAccessRequests: accessRequestActions.resetAccessRequests,
      resetAccessRequest: accessRequestActions.resetAccessRequest,
      clearGlobalError,
      setGlobalError,
      getOnDemandMetrics,
      getAddOns,
      getClusterAddOns,
      getGrants,
      getClusterRouters,
      getMachineOrNodePools,
      clearGetMachinePoolsResponse,
      clearGetClusterAutoscalerResponse: clusterAutoscalerActions.clearClusterAutoscalerResponse,
      clearListVpcs,
      getClusterHistory: clusterLogActions.getClusterHistory,
      getAccessRequests: accessRequestActions.getAccessRequests,
      getPendingAccessRequests: accessRequestActions.getPendingAccessRequests,
      toggleSubscriptionReleased,
      getNotificationContacts,
      getSupportCases,
      getSchedules,
      getUserAccess,
      addNotification,
      fetchUpgradeGates,
      clearFiltersAndFlags: () => onClearFiltersAndFlags(viewConstants.CLUSTER_LOGS_VIEW),
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ClusterDetails);
