import { connect } from 'react-redux';

import ClusterDetails from './ClusterDetails';
import {
  clustersActions,
  fetchClusterDetails,
  invalidateClusters,
} from '../../../redux/actions/clustersActions';
import { getLogs } from './components/LogWindow/LogWindowActions';
import { getClusterIdentityProviders, resetIdentityProvidersState } from './components/IdentityProvidersModal/IdentityProvidersActions';
import usersActions from './components/Users/UsersActions';
import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';
import { setGlobalError, clearGlobalError } from '../../../redux/actions/globalErrorActions';
import { userActions } from '../../../redux/actions/userActions';
import { modalActions } from '../../common/Modal/ModalActions';
import { getAlerts, getNodes, getClusterOperators } from './components/Monitoring/MonitoringActions';

const mapStateToProps = (state) => {
  const { details, archivedCluster, unarchivedCluster } = state.clusters;
  const { cloudProviders } = state.cloudProviders;
  const { logs } = state.logs;
  const { clusterIdentityProviders } = state.identityProviders;
  const { organization } = state.userProfile;

  return ({
    cloudProviders,
    clusterDetails: details,
    logs,
    clusterIdentityProviders,
    organization,
    showArchivedToast: archivedCluster.showToast,
    showUnarchivedToast: unarchivedCluster.showToast,
  });
};

const mapDispatchToProps = {
  fetchDetails: clusterID => fetchClusterDetails(clusterID),
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
  closeArchivedToast: clustersActions.clearClusterArchiveToast,
  closeUnarchivedToast: clustersActions.clearClusterUnarchiveToast,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterDetails);
