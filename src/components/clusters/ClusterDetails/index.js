import { connect } from 'react-redux';

import ClusterDetails from './ClusterDetails';
import {
  fetchClusterDetails,
  invalidateClusters,
} from '../../../redux/actions/clustersActions';
import {
  fetchClusterInsights,
} from '../../../redux/actions/insightsActions';
import { getLogs } from './components/LogWindow/LogWindowActions';
import { getClusterIdentityProviders, resetIdentityProvidersState } from './components/IdentityProvidersModal/IdentityProvidersActions';
import usersActions from './components/AccessControl/UsersSection/UsersActions';
import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';
import { setGlobalError, clearGlobalError } from '../../../redux/actions/globalErrorActions';
import { userActions } from '../../../redux/actions/userActions';
import { modalActions } from '../../common/Modal/ModalActions';
import { getAlerts, getNodes, getClusterOperators } from './components/Monitoring/MonitoringActions';
import { getAddOns, getClusterAddOns } from './components/AddOns/AddOnsActions';
import { getGrants } from './components/AccessControl/NetworkSelfServiceSection/NetworkSelfServiceActions';
import { getClusterHistory } from './components/ClusterLogs/clusterLogActions';
import { viewConstants } from '../../../redux/constants';

const mapStateToProps = (state) => {
  const { details } = state.clusters;
  const { cloudProviders } = state;
  const { logs } = state;
  const { errorCode } = state.clusterLogs.requestState;
  const { addOns, clusterAddOns } = state.addOns;
  const { clusterIdentityProviders } = state.identityProviders;
  const { organization } = state.userProfile;
  const { insights } = state.insights;

  return ({
    cloudProviders,
    clusterDetails: details,
    logs,
    addOns,
    clusterAddOns,
    clusterIdentityProviders,
    organization,
    displayClusterLogs: errorCode !== 403 && errorCode !== 404,
    clusterLogsViewOptions: state.viewOptions[viewConstants.CLUSTER_LOGS_VIEW],
    insights,
  });
};

const mapDispatchToProps = {
  fetchDetails: clusterID => fetchClusterDetails(clusterID),
  fetchInsights: clusterID => fetchClusterInsights(clusterID),
  getCloudProviders: cloudProviderActions.getCloudProviders,
  getOrganizationAndQuota: userActions.getOrganizationAndQuota,
  invalidateClusters,
  openModal: modalActions.openModal,
  closeModal: modalActions.closeModal,
  getLogs,
  getClusterIdentityProviders,
  getUsers: usersActions.getUsers,
  resetIdentityProvidersState,
  clearGlobalError,
  setGlobalError,
  getAlerts,
  getNodes,
  getClusterOperators,
  getAddOns,
  getClusterAddOns,
  getGrants,
  getClusterHistory: (
    externalClusterID, queryObj,
  ) => getClusterHistory(externalClusterID, queryObj),
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterDetails);
