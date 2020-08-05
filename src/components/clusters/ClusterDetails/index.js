import { connect } from 'react-redux';

import size from 'lodash/size';
import isEmpty from 'lodash/isEmpty';
import ClusterDetails from './ClusterDetails';
import {
  fetchClusterDetails,
  invalidateClusters,
} from '../../../redux/actions/clustersActions';

import {
  getClusterIdentityProviders,
  resetIdentityProvidersState,
} from './components/IdentityProvidersModal/IdentityProvidersActions';
import usersActions from './components/AccessControl/UsersSection/UsersActions';
import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';
import { setGlobalError, clearGlobalError } from '../../../redux/actions/globalErrorActions';
import { userActions } from '../../../redux/actions/userActions';
import { modalActions } from '../../common/Modal/ModalActions';
import {
  getAlerts,
  getNodes,
  getClusterOperators,
} from './components/Monitoring/MonitoringActions';
import { getAddOns, getClusterAddOns } from './components/AddOns/AddOnsActions';
import { getGrants } from './components/AccessControl/NetworkSelfServiceSection/NetworkSelfServiceActions';
import { getClusterHistory, clusterLogActions } from './components/ClusterLogs/clusterLogActions';
import { getClusterRouters } from './components/Networking/NetworkingActions';
import { viewConstants } from '../../../redux/constants';
import {
  fetchClusterInsights,
  voteOnRuleInsights,
  disableRuleInsights,
  enableRuleInsights,
  fetchGroups,
} from './components/Insights/InsightsActions';
import canAllowAdminSelector from '../common/ToggleClusterAdminAccessDialog/ClusterAdminSelectors';
import canSubscribeOCPSelector from '../common/EditSubscriptionSettingsDialog/CanSubscribeOCPSelector';
import { canTransferClusterOwnershipSelector } from '../common/TransferClusterOwnershipDialog/TransferClusterOwnershipDialogSelectors';
import { issuesAndWarningsSelector } from './components/Monitoring/MonitoringSelectors';
import helpers from '../../../common/helpers';
import { toggleSubscriptionReleased } from '../common/TransferClusterOwnershipDialog/subscriptionReleasedActions';

const mapStateToProps = (state) => {
  const { details } = state.clusters;
  const { cloudProviders } = state;
  const { errorCode } = state.clusterLogs.requestState;
  const { addOns, clusterAddOns } = state.addOns;
  const { clusterIdentityProviders } = state.identityProviders;
  const { organization } = state.userProfile;
  const { insightsData, groups } = state.insightsData;
  const { filter, flags } = state.viewOptions[viewConstants.CLUSTER_LOGS_VIEW];
  const hasNoFilters = isEmpty(filter.description)
  && helpers.nestedIsEmpty(flags.conditionalFilterFlags.severityTypes);
  const logsFulfilled = state.clusterLogs.requestState.fulfilled;
  const hideClusterLogs = (hasNoFilters && !size(state.clusterLogs.logs) && logsFulfilled)
  || errorCode === 403 || errorCode === 404;

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
  });
};

const mapDispatchToProps = {
  fetchDetails: clusterId => fetchClusterDetails(clusterId),
  fetchInsightsData: clusterId => fetchClusterInsights(clusterId),
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
  getClusterHistory: (
    externalClusterID, queryObj,
  ) => getClusterHistory(externalClusterID, queryObj),
  toggleSubscriptionReleased,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterDetails);
