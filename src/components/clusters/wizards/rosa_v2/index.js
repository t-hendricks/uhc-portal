import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { normalizedProducts } from '~/common/subscriptionTypes';
import { getCloudProviders } from '~/redux/actions/cloudProviderActions';
import {
  clearInstallableVersions,
  resetCreatedClusterResponse,
} from '~/redux/actions/clustersActions';
import { getMachineTypes } from '~/redux/actions/machineTypesActions';
import { clearGetUserRoleResponse, getUserRole } from '~/redux/actions/rosaActions';
import { getOrganizationAndQuota } from '~/redux/actions/userActions';

import { closeModal, openModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';
import { hasManagedQuotaSelector } from '../../common/quotaSelectors';
import submitOSDRequest from '../common/submitOSDRequest';

import CreateROSAWizard from './CreateROSAWizard';

const mapStateToProps = (state) => {
  const { organization } = state.userProfile;
  const { getUserRoleResponse } = state.rosaReducer;
  const { clusterVersions } = state?.clusters || {};

  return {
    isErrorModalOpen: shouldShowModal(state, 'osd-create-error'), // TODO: change 'osd' to 'rosa'
    createClusterResponse: state.clusters.createdCluster,
    machineTypes: state.machineTypes,
    organization,
    cloudProviders: state.cloudProviders,
    hasProductQuota: hasManagedQuotaSelector(
      state.userProfile.organization.quotaList,
      normalizedProducts.ROSA,
    ),
    getUserRoleResponse,
    getInstallableVersionsResponse: clusterVersions,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (formikValues) =>
    dispatch(() => {
      // If changing these params, keep test & DebugClusterRequest props synced.
      const params = { isWizard: true };
      return submitOSDRequest(dispatch, params)(formikValues); // TODO: change to submitROSARequest(...
    }),
  resetResponse: () => dispatch(resetCreatedClusterResponse()),
  openModal: (modalName) => {
    dispatch(openModal(modalName));
  },
  closeModal: () => {
    dispatch(closeModal());
  },
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
  getUserRole: () => dispatch(getUserRole()),
  getMachineTypes: () => dispatch(getMachineTypes()),
  getCloudProviders: () => dispatch(getCloudProviders()),
  clearGetUserRoleResponse: () => dispatch(clearGetUserRoleResponse()),
  clearInstallableVersions: () => dispatch(clearInstallableVersions()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateROSAWizard));
