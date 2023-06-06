import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  isValid,
  isAsyncValidating,
  reset,
  formValueSelector,
  getFormValues,
  getFormSyncErrors,
  getFormAsyncErrors,
  touch,
} from 'redux-form';
import { resetCreatedClusterResponse } from '~/redux/actions/clustersActions';
import { getMachineTypes } from '~/redux/actions/machineTypesActions';
import { getOrganizationAndQuota } from '~/redux/actions/userActions';
import { getCloudProviders } from '~/redux/actions/cloudProviderActions';
import getLoadBalancerValues from '~/redux/actions/loadBalancerActions';
import getPersistentStorageValues from '~/redux/actions/persistentStorageActions';
import CreateOSDWizard from './CreateOSDWizard';
import shouldShowModal from '../../../common/Modal/ModalSelectors';
import { openModal, closeModal } from '../../../common/Modal/ModalActions';

import { hasManagedQuotaSelector } from '../../common/quotaSelectors';
import isCCSCredentialsValidationNeeded from './isCCSCredentialsValidationNeeded';
import ccsCredentialsSelector from './credentialsSelector';
import { getGCPCloudProviderVPCs, getAWSCloudProviderRegions } from './ccsInquiriesActions';

import submitOSDRequest from '../submitOSDRequest';

const mapStateToProps = (state, ownProps) => {
  const { organization } = state.userProfile;

  const valueSelector = formValueSelector('CreateCluster');
  const formSyncErrors = getFormSyncErrors('CreateCluster')(state) ?? {};
  const formAsyncErrors = getFormAsyncErrors('CreateCluster')(state) ?? {};

  // The user may select a different product after entering the creation page
  // thus it could differ from the product in the URL
  const selectedProduct = valueSelector(state, 'product');
  const product = selectedProduct || ownProps.product;
  const cloudProviderID = valueSelector(state, 'cloud_provider');
  const ccsCredentialsValidityResponse = state.ccsInquiries.ccsCredentialsValidity;

  const isCCS = valueSelector(state, 'byoc') === 'true';

  return {
    isValid: isValid('CreateCluster')(state),
    isAsyncValidating: isAsyncValidating('CreateCluster')(state),
    isErrorModalOpen: shouldShowModal(state, 'osd-create-error'),
    ccsCredentials: ccsCredentialsSelector(cloudProviderID, state),
    isCCS,
    ccsCredentialsValidityResponse,
    isCCSCredentialsValidationNeeded: isCCSCredentialsValidationNeeded(cloudProviderID, state),
    cloudProviderID,
    installToVPCSelected: valueSelector(state, 'install_to_vpc'),
    privateLinkSelected: valueSelector(state, 'use_privatelink'),
    configureProxySelected: valueSelector(state, 'configure_proxy'),
    createClusterResponse: state.clusters.createdCluster,
    machineTypes: state.machineTypes,
    organization,
    cloudProviders: state.cloudProviders,
    loadBalancerValues: state.loadBalancerValues,
    persistentStorageValues: state.persistentStorageValues,
    hasProductQuota: hasManagedQuotaSelector(state, product),
    formErrors: {
      ...formSyncErrors,
      ...formAsyncErrors,
    },
    formSyncErrors,
    formAsyncErrors,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSubmit: () =>
    dispatch((_, getState) => {
      const formData = getFormValues('CreateCluster')(getState());
      // If changing these params, keep test & DebugClusterRequest props synced.
      const params = { isWizard: true };
      return submitOSDRequest(dispatch, params)(formData);
    }),
  resetResponse: () => dispatch(resetCreatedClusterResponse()),
  resetForm: () => dispatch(reset('CreateCluster')),
  openModal: (modalName) => dispatch(openModal(modalName)),
  closeModal: () => {
    dispatch(closeModal());
  },
  touch: (fieldNames) => dispatch(touch('CreateCluster', ...fieldNames)),
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
  getMachineTypes: () => dispatch(getMachineTypes()),
  getCloudProviders: () => dispatch(getCloudProviders()),
  getPersistentStorage: () => dispatch(getPersistentStorageValues()),
  getLoadBalancers: () => dispatch(getLoadBalancerValues()),
  getGCPCloudProviderVPCs: (type, credentials, region) =>
    dispatch(getGCPCloudProviderVPCs(type, credentials, region)),
  getAWSCloudProviderRegions: (credentials) => dispatch(getAWSCloudProviderRegions(credentials)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateOSDWizard));
