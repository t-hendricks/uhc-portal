import { connect } from 'react-redux';

import size from 'lodash/size';
import isEmpty from 'lodash/isEmpty';
import ClusterDetails from './ClusterDetails';
import {
  fetchClusterDetails,
  invalidateClusters,
} from '../../../redux/actions/clustersActions';
import { getLogs } from './components/LogWindow/LogWindowActions';
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
import { getClusterHistory } from './components/ClusterLogs/clusterLogActions';
import { getClusterRouters } from './components/Networking/NetworkingActions';
import { viewConstants } from '../../../redux/constants';
import {
  fetchClusterInsights, voteOnRuleInsights, disableRuleInsights, enableRuleInsights,
} from './components/Insights/InsightsActions';
import canAllowAdminSelector from '../common/ToggleClusterAdminAccessDialog/ClusterAdminSelectors';
import helpers from '../../../common/helpers';

const mapStateToProps = (state) => {
  const { details } = state.clusters;
  const { cloudProviders } = state;
  const { errorCode } = state.clusterLogs.requestState;
  const { logs, clusterRouters } = state;
  const { addOns, clusterAddOns } = state.addOns;
  const { clusterIdentityProviders } = state.identityProviders;
  const { organization } = state.userProfile;
  const { insightsData } = state.insightsData;
  const { filter, flags } = state.viewOptions[viewConstants.CLUSTER_LOGS_VIEW];
  const hasNoFilters = isEmpty(filter.description)
  && helpers.nestedIsEmpty(flags.conditionalFilterFlags.severityTypesFilter);
  const logsFulfilled = state.clusterLogs.requestState.fulfilled;
  const hideClusterLogs = (hasNoFilters && !size(state.clusterLogs.logs) && logsFulfilled)
  || errorCode === 403 || errorCode === 404;

  return ({
    cloudProviders,
    clusterDetails: details,
    logs,
    addOns,
    clusterAddOns,
    clusterIdentityProviders,
    organization,
    displayClusterLogs: !hideClusterLogs,
    clusterRouters,
    clusterLogsViewOptions: state.viewOptions[viewConstants.CLUSTER_LOGS_VIEW],
    insightsData,
    canAllowClusterAdmin: canAllowAdminSelector(state),
    anyModalOpen: !!state.modal.modalName,
  });
};

const mapDispatchToProps = {
  fetchDetails: clusterId => fetchClusterDetails(clusterId),
  fetchInsightsData: clusterId => fetchClusterInsights(clusterId),
  voteOnRule: (clusterId, ruleId, vote) => voteOnRuleInsights(clusterId, ruleId, vote),
  disableRule: (clusterId, ruleId) => disableRuleInsights(clusterId, ruleId),
  enableRule: (clusterId, ruleId) => enableRuleInsights(clusterId, ruleId),
  getCloudProviders: cloudProviderActions.getCloudProviders,
  getOrganizationAndQuota: userActions.getOrganizationAndQuota,
  invalidateClusters,
  openModal: modalActions.openModal,
  closeModal: modalActions.closeModal,
  getLogs,
  getClusterIdentityProviders,
  getDedicatedAdmins: usersActions.getDedicatedAdmins,
  getClusterAdmins: usersActions.getClusterAdmins,
  resetIdentityProvidersState,
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
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterDetails);
