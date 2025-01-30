import { connect } from 'react-redux';

import { accessProtectionActions } from '~/redux/actions/accessProtectionActions';
import { accessRequestActions } from '~/redux/actions/accessRequestActions';

import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';
import { clustersActions } from '../../../redux/actions/clustersActions';
import { clearGlobalError } from '../../../redux/actions/globalErrorActions';
import { machineTypesActions } from '../../../redux/actions/machineTypesActions';
import { toggleSubscriptionReleased } from '../../../redux/actions/subscriptionReleasedActions';
import { userActions } from '../../../redux/actions/userActions';
import { onListFlagsSet, viewActions } from '../../../redux/actions/viewOptionsActions';
import { viewConstants } from '../../../redux/constants';
import { modalActions } from '../../common/Modal/ModalActions';
import canSubscribeOCPListSelector from '../common/archived_do_not_use/EditSubscriptionSettingsDialog/canSubscribeOCPListSelector';
import { canHibernateClusterListSelector } from '../common/archived_do_not_use/HibernateClusterModal/HibernateClusterModalSelectors';
import { canTransferClusterOwnershipListSelector } from '../common/archived_do_not_use/TransferClusterOwnershipDialog/utils/transferClusterOwnershipDialogSelectors';

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
  getOrganizationPendingAccessRequests: accessRequestActions.getOrganizationPendingAccessRequests,
  resetOrganizationPendingAccessRequests:
    accessRequestActions.resetOrganizationPendingAccessRequests,
  getOrganizationAccessProtection: accessProtectionActions.getOrganizationAccessProtection,
  resetOrganizationAccessProtection: accessProtectionActions.resetOrganizationAccessProtection,
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
  organizationId: state.userProfile?.organization?.details?.id,
  anyModalOpen: !!state.modal.modalName,
  features: state.features,
  pendingOrganizationAccessRequests: state.accessRequest.pendingOrganizationAccessRequests,
  isOrganizationAccessProtectionEnabled:
    state.accessProtection.organizationAccessProtection.enabled,
  canSubscribeOCPList: canSubscribeOCPListSelector(state),
  canHibernateClusterList: canHibernateClusterListSelector(state),
  canTransferClusterOwnershipList: canTransferClusterOwnershipListSelector(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClusterList);
