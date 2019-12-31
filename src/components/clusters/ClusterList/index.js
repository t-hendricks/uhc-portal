import { connect } from 'react-redux';
import ClusterList from './ClusterList';

import { clustersActions } from '../../../redux/actions/clustersActions';
import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';
import { viewConstants } from '../../../redux/constants';
import { viewActions } from '../../../redux/actions/viewOptionsActions';
import { modalActions } from '../../common/Modal/ModalActions';
import { getOrganizationAndQuota } from '../../../redux/actions/userActions';

const mapDispatchToProps = {
  invalidateClusters: () => clustersActions.invalidateClusters(),
  fetchClusters: queryObj => clustersActions.fetchClusters(queryObj),
  setSorting: sorting => viewActions.onListSortBy(sorting, viewConstants.CLUSTERS_VIEW),
  setListFlag: (key, value) => viewActions.onListFlagsSet(key, value, viewConstants.CLUSTERS_VIEW),
  getCloudProviders: cloudProviderActions.getCloudProviders,
  openModal: modalActions.openModal,
  closeModal: modalActions.closeModal,
  getOrganizationAndQuota,
};


const mapStateToProps = state => ({

  ...state.clusters.clusters,
  viewOptions: state.viewOptions[viewConstants.CLUSTERS_VIEW],
  cloudProviders: state.cloudProviders.cloudProviders,
  organization: state.userProfile.organization,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClusterList);
