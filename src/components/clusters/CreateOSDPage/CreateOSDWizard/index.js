import { connect } from 'react-redux';
import {
  isValid, reset, formValueSelector, getFormValues,
} from 'redux-form';
import { resetCreatedClusterResponse } from '../../../../redux/actions/clustersActions';
import { getMachineTypes } from '../../../../redux/actions/machineTypesActions';
import { getOrganizationAndQuota } from '../../../../redux/actions/userActions';
import { getCloudProviders } from '../../../../redux/actions/cloudProviderActions';
import getLoadBalancerValues from '../../../../redux/actions/loadBalancerActions';
import getPersistentStorageValues from '../../../../redux/actions/persistentStorageActions';
import CreateOSDWizard from './CreateOSDWizard';
import shouldShowModal from '../../../common/Modal/ModalSelectors';
import { openModal, closeModal } from '../../../common/Modal/ModalActions';

import {
  hasManagedQuotaSelector,
} from '../../common/quotaSelectors';

import submitOSDRequest from '../submitOSDRequest';

const mapStateToProps = (state, ownProps) => {
  const { organization } = state.userProfile;

  const valueSelector = formValueSelector('CreateCluster');

  // The user may select a different product after entering the creation page
  // thus it could differ from the product in the URL
  const selectedProduct = valueSelector(state, 'product');
  const product = selectedProduct || ownProps.product;

  const isByoc = valueSelector(state, 'byoc') === 'true';

  return ({
    isValid: isValid('CreateCluster')(state),
    isByoc,
    isErrorModalOpen: shouldShowModal(state, 'osd-create-error'),

    createClusterResponse: state.clusters.createdCluster,
    machineTypes: state.machineTypes,
    organization,
    cloudProviders: state.cloudProviders,
    loadBalancerValues: state.loadBalancerValues,
    persistentStorageValues: state.persistentStorageValues,

    hasProductQuota: hasManagedQuotaSelector(state, product),
  });
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: () => dispatch((_, getState) => {
    const formData = getFormValues('CreateCluster')(getState());
    return submitOSDRequest(dispatch, ownProps)(formData);
  }),
  resetResponse: () => dispatch(resetCreatedClusterResponse()),
  resetForm: () => dispatch(reset('CreateCluster')),
  openModal: (modalName) => { dispatch(openModal(modalName)); },
  closeModal: () => { dispatch(closeModal()); },

  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
  getMachineTypes: () => dispatch(getMachineTypes()),
  getCloudProviders: () => dispatch(getCloudProviders()),
  getPersistentStorage: () => dispatch(getPersistentStorageValues()),
  getLoadBalancers: () => dispatch(getLoadBalancerValues()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateOSDWizard);
