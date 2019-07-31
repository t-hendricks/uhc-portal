import { connect } from 'react-redux';
import ClusterList from './ClusterList';

import { clustersActions } from '../../../redux/actions/clustersActions';
import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';
import { viewConstants } from '../../../redux/constants';
import { viewActions } from '../../../redux/actions/viewOptionsActions';
import { modalActions } from '../../common/Modal/ModalActions';
import { getOrganizationAndQuota } from '../../../redux/actions/userActions';

import hasQuota from '../../../common/quotaSelector';

const mapDispatchToProps = {
  invalidateClusters: () => clustersActions.invalidateClusters(),
  fetchClusters: queryObj => clustersActions.fetchClusters(queryObj),
  setSorting: sorting => viewActions.onListSortBy(sorting, viewConstants.CLUSTERS_VIEW),
  getCloudProviders: cloudProviderActions.getCloudProviders,
  openModal: modalActions.openModal,
  getOrganizationAndQuota,
};


const mapStateToProps = (state) => {
  const { quota } = state.userProfile;

  return Object.assign(
    {},
    state.clusters.clusters,
    {
      viewOptions: state.viewOptions[viewConstants.CLUSTERS_VIEW],
      cloudProviders: state.cloudProviders.cloudProviders,
      organization: state.userProfile.organization,
      quota,
      hasQuota: hasQuota(quota.quotaList.items || []),
    },
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClusterList);
