import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  resetCreatedClusterResponse,
  clearInstallableVersions,
} from '~/redux/actions/clustersActions';
import { getMachineTypes } from '~/redux/actions/machineTypesActions';
import { getOrganizationAndQuota } from '~/redux/actions/userActions';
import { getCloudProviders } from '~/redux/actions/cloudProviderActions';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { getUserRole, clearGetUserRoleResponse } from '~/redux/actions/rosaActions';
import CreateROSAWizard from './CreateROSAWizard';
import shouldShowModal from '../../../common/Modal/ModalSelectors';
import { openModal, closeModal } from '../../../common/Modal/ModalActions';
import { hasManagedQuotaSelector } from '../../common/quotaSelectors';
import submitOSDRequest from '../common/submitOSDRequest';

const mapStateToProps = (state) => {
  const { organization } = state.userProfile;
  const { getUserRoleResponse } = state.rosaReducer;
  const { clusterVersions } = state?.clusters || {};

  return {
    isErrorModalOpen: shouldShowModal(state, 'osd-create-error'), // TODO: change 'osd' to 'rosa'
    cloudProviderID: 'aws',
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
