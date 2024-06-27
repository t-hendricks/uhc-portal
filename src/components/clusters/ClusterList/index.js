import { connect } from 'react-redux';

import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';
import { clustersActions } from '../../../redux/actions/clustersActions';
import { clearGlobalError } from '../../../redux/actions/globalErrorActions';
import { machineTypesActions } from '../../../redux/actions/machineTypesActions';
import { toggleSubscriptionReleased } from '../../../redux/actions/subscriptionReleasedActions';
import { userActions } from '../../../redux/actions/userActions';
import { onListFlagsSet, viewActions } from '../../../redux/actions/viewOptionsActions';
import { viewConstants } from '../../../redux/constants';
import { modalActions } from '../../common/Modal/ModalActions';
import canSubscribeOCPListSelector from '../common/EditSubscriptionSettingsDialog/CanSubscribeOCPListSelector';
import { canHibernateClusterListSelector } from '../common/HibernateClusterModal/HibernateClusterModalSelectors';
import { canTransferClusterOwnershipListSelector } from '../common/TransferClusterOwnershipDialog/utils/transferClusterOwnershipDialogSelectors';

import ClusterList from './ClusterList';

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
  onListFlagsSet,
};

const mapStateToProps = (state) => ({
  ...state.clusters.clusters,
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
