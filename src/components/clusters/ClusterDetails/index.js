import { connect } from 'react-redux';

import ClusterDetails from './ClusterDetails';
import {
  fetchClusterDetails,
  fetchClusterCredentials,
  fetchClusterRouterShards,
  invalidateClusters,
} from '../../../redux/actions/clustersActions';
import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';
import { modalActions } from '../../common/Modal/ModalActions';

const mapStateToProps = (state) => {
  const { details, credentials, routerShards } = state.clusters;
  const { cloudProviders } = state.cloudProviders;

  return ({
    clusterDetails: details,
    cloudProviders,
    credentials,
    routerShards,
  });
};

const mapDispatchToProps = {
  fetchDetails: clusterID => fetchClusterDetails(clusterID),
  fetchCredentials: clusterID => fetchClusterCredentials(clusterID),
  fetchRouterShards: clusterID => fetchClusterRouterShards(clusterID),
  getCloudProviders: cloudProviderActions.getCloudProviders,
  invalidateClusters,
  openModal: modalActions.openModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterDetails);
