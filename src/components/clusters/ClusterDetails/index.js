import { connect } from 'react-redux';

import ClusterDetails from './ClusterDetails';
import {
  fetchClusterDetails,
  fetchClusterRouterShards,
  invalidateClusters,
} from '../../../redux/actions/clustersActions';
import { getLogs } from './components/LogWindow/LogWindowActions';
import { getClusterIdentityProviders, resetIdentityProvidersState } from './components/IdentityProvidersModal/IdentityProvidersActions';
import usersActions from './components/Users/UsersActions';
import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';
import { setGlobalError, clearGlobalError } from '../../../redux/actions/globalErrorActions';
import { userActions } from '../../../redux/actions/userActions';
import { modalActions } from '../../common/Modal/ModalActions';

const mapStateToProps = (state) => {
  const { details, routerShards } = state.clusters;
  const { cloudProviders } = state.cloudProviders;
  const { logs } = state.logs;
  const { clusterIdentityProviders } = state.identityProviders;
  const { organization } = state.userProfile;

  return ({
    clusterDetails: details,
    cloudProviders,
    routerShards,
    logs,
    clusterIdentityProviders,
    organization,
  });
};

const mapDispatchToProps = {
  fetchDetails: clusterID => fetchClusterDetails(clusterID),
  fetchRouterShards: clusterID => fetchClusterRouterShards(clusterID),
  getCloudProviders: cloudProviderActions.getCloudProviders,
  getOrganization: userActions.getOrganization,
  invalidateClusters,
  openModal: modalActions.openModal,
  getLogs,
  getClusterIdentityProviders,
  getUsers: usersActions.getUsers,
  resetIdentityProvidersState,
  clearGlobalError,
  setGlobalError,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterDetails);
