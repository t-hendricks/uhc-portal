import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  destroy,
  formValueSelector,
  getFormAsyncErrors,
  getFormSyncErrors,
  getFormValues,
  isAsyncValidating,
  isValid,
  touch,
} from 'redux-form';

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
  destroyForm: () => dispatch(destroy('CreateCluster')),
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
