import { connect } from 'react-redux';

import ClusterDetails from './ClusterDetails';
import {
  fetchClusterDetails,
  fetchClusterCredentials,
  fetchClusterRouterShards,
  invalidateClusters,
} from '../../../redux/actions/clustersActions';
import { getLogs } from './components/LogWindow/LogWindowActions';
import { getClusterIdentityProviders, resetIdentityProvidersState } from './components/IdentityProvidersModal/IdentityProvidersActions';
import usersActions from './components/Users/UsersActions';
import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';
import { userActions } from '../../../redux/actions/userActions';
import { modalActions } from '../../common/Modal/ModalActions';

const mapStateToProps = (state) => {
  const { details, credentials, routerShards } = state.clusters;
  const { cloudProviders } = state.cloudProviders;
  const { logs } = state.logs;
  const { clusterIdentityProviders } = state.identityProviders;
  const { organization } = state.userProfile;

  return ({
    clusterDetails: details,
    cloudProviders,
    credentials,
    routerShards,
    logs,
    clusterIdentityProviders,
    organization,
  });
};

const mapDispatchToProps = {
  fetchDetails: clusterID => fetchClusterDetails(clusterID),
  fetchCredentials: clusterID => fetchClusterCredentials(clusterID),
  fetchRouterShards: clusterID => fetchClusterRouterShards(clusterID),
  getCloudProviders: cloudProviderActions.getCloudProviders,
  getOrganization: userActions.getOrganization,
  invalidateClusters,
  openModal: modalActions.openModal,
  getLogs,
  getClusterIdentityProviders,
  getUsers: usersActions.getUsers,
  resetIdentityProvidersState,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterDetails);
