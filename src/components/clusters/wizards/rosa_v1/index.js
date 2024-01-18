import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  isValid,
  isAsyncValidating,
  reset,
  formValueSelector,
  getFormValues,
  touch,
  getFormSyncErrors,
  getFormAsyncErrors,
} from 'redux-form';
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
import submitOSDRequest from '../../CreateOSDPage/submitOSDRequest';

const mapStateToProps = (state) => {
  const { organization } = state.userProfile;
  const { getUserRoleResponse } = state.rosaReducer;
  const valueSelector = formValueSelector('CreateCluster');
  const formSyncErrors = getFormSyncErrors('CreateCluster')(state) ?? {};
  const formAsyncErrors = getFormAsyncErrors('CreateCluster')(state) ?? {};
  const { clusterVersions } = state?.clusters || {};

  return {
    isValid: isValid('CreateCluster')(state),
    isAsyncValidating: isAsyncValidating('CreateCluster')(state),
    isErrorModalOpen: shouldShowModal(state, 'osd-create-error'), // TODO: change 'osd' to 'rosa'
    cloudProviderID: 'aws',
    installToVPCSelected: valueSelector(state, 'install_to_vpc'),
    privateLinkSelected: valueSelector(state, 'use_privatelink'),
    configureProxySelected: valueSelector(state, 'configure_proxy'),
    createClusterResponse: state.clusters.createdCluster,
    machineTypes: state.machineTypes,
    organization,
    cloudProviders: state.cloudProviders,
    hasProductQuota: hasManagedQuotaSelector(
      state.userProfile.organization.quotaList,
      normalizedProducts.ROSA,
    ),
    formValues: getFormValues('CreateCluster')(state) ?? {},
    formErrors: {
      ...formSyncErrors,
      ...formAsyncErrors,
    },
    getUserRoleResponse,
    selectedAWSAccountID: valueSelector(state, 'associated_aws_id'),
    isHypershiftSelected: valueSelector(state, 'hypershift') === 'true',
    getInstallableVersionsResponse: clusterVersions,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSubmit: () =>
    dispatch((_, getState) => {
      const formData = getFormValues('CreateCluster')(getState());
      // If changing these params, keep test & DebugClusterRequest props synced.
      const params = { isWizard: true };
      return submitOSDRequest(dispatch, params)(formData); // TODO: change to submitROSARequest(...
    }),
  resetResponse: () => dispatch(resetCreatedClusterResponse()),
  resetForm: () => dispatch(reset('CreateCluster')),
  openModal: (modalName) => {
    dispatch(openModal(modalName));
  },
  closeModal: () => {
    dispatch(closeModal());
  },
  touch: (fieldNames) => dispatch(touch('CreateCluster', ...fieldNames)),
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
  getUserRole: () => dispatch(getUserRole()),
  getMachineTypes: () => dispatch(getMachineTypes()),
  getCloudProviders: () => dispatch(getCloudProviders()),
  clearGetUserRoleResponse: () => dispatch(clearGetUserRoleResponse()),
  clearInstallableVersions: () => dispatch(clearInstallableVersions()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateROSAWizard));
