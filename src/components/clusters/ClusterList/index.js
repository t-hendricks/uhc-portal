import { connect } from 'react-redux';
import ClusterList from './ClusterList';

import { clustersActions } from '../../../redux/actions/clustersActions';
import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';
import { machineTypesActions } from '../../../redux/actions/machineTypesActions';
import { viewConstants } from '../../../redux/constants';
import { viewActions } from '../../../redux/actions/viewOptionsActions';
import { userActions } from '../../../redux/actions/userActions';
import { modalActions } from '../../common/Modal/ModalActions';
import canSubscribeOCPListSelector from '../common/EditSubscriptionSettingsDialog/CanSubscribeOCPListSelector';
import { canTransferClusterOwnershipListSelector } from '../common/TransferClusterOwnershipDialog/TransferClusterOwnershipDialogSelectors';
import canHibernateClusterListSelector from '../common/HibernateClusterModal/CanHibernateClusterListSelector';
import { toggleSubscriptionReleased } from '../common/TransferClusterOwnershipDialog/subscriptionReleasedActions';
import { clearGlobalError } from '../../../redux/actions/globalErrorActions';
import { hiddenProductTypes } from '~/common/subscriptionTypes';

const mapDispatchToProps = {
  invalidateClusters: () => clustersActions.invalidateClusters(),
  fetchClusters: (queryObj) => clustersActions.fetchClusters(queryObj),
  setClusterDetails: clustersActions.setClusterDetails,
  clearClusterDetails: clustersActions.clearClusterDetails,
  setSorting: (sorting) => viewActions.onListSortBy(sorting, viewConstants.CLUSTERS_VIEW),
  setListFlag: (key, value) => viewActions.onListFlagsSet(key, value, viewConstants.CLUSTERS_VIEW),
  getCloudProviders: cloudProviderActions.getCloudProviders,
  getMachineTypes: machineTypesActions.getMachineTypes,
  getOrganizationAndQuota: userActions.getOrganizationAndQuota,
  openModal: modalActions.openModal,
  closeModal: modalActions.closeModal,
  toggleSubscriptionReleased,
  clearGlobalError,
};

const mapStateToProps = (state) => ({
  ...state.clusters.clusters,
  clusters: state.clusters.clusters.clusters.filter(
    (cluster) =>
      // These subscription types exist primarily to extend quota and subscription
      // management capabilities, and are not meant to be visible to customers.
      !hiddenProductTypes.includes(cluster.subscription.plan.id),
  ),
  viewOptions: state.viewOptions[viewConstants.CLUSTERS_VIEW],
  username: state.userProfile.keycloakProfile.username,
  cloudProviders: state.cloudProviders,
  machineTypes: state.machineTypes,
  organization: state.userProfile.organization,
  anyModalOpen: !!state.modal.modalName,
  features: state.features,
  canSubscribeOCPList: canSubscribeOCPListSelector(state),
  canHibernateClusterList: canHibernateClusterListSelector(state),
  canTransferClusterOwnershipList: canTransferClusterOwnershipListSelector(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClusterList);
