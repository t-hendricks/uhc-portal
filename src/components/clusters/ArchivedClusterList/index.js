import { connect } from 'react-redux';
import ArchivedClusterList from './ArchivedClusterList';

import { clustersActions } from '../../../redux/actions/clustersActions';
import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';
import { viewConstants } from '../../../redux/constants';
import { viewActions } from '../../../redux/actions/viewOptionsActions';
import { modalActions } from '../../common/Modal/ModalActions';
import { clearGlobalError } from '../../../redux/actions/globalErrorActions';

const mapDispatchToProps = {
  invalidateClusters: () => clustersActions.invalidateClusters(),
  fetchClusters: queryObj => clustersActions.fetchClusters(queryObj),
  setSorting: sorting => viewActions.onListSortBy(sorting, viewConstants.ARCHIVED_CLUSTERS_VIEW),
  setListFlag: (key, value) => viewActions.onListFlagsSet(key, value,
    viewConstants.ARCHIVED_CLUSTERS_VIEW),
  getCloudProviders: cloudProviderActions.getCloudProviders,
  openModal: modalActions.openModal,
  closeModal: modalActions.closeModal,
  clearGlobalError,
};

const mapStateToProps = state => ({
  ...state.clusters.clusters,
  username: state.userProfile.keycloakProfile.username,
  viewOptions: state.viewOptions[viewConstants.ARCHIVED_CLUSTERS_VIEW],
  cloudProviders: state.cloudProviders,
  sortByIndex: state.sortByIndex,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ArchivedClusterList);
