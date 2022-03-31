import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  isValid, reset, formValueSelector, getFormValues, getFormMeta,
} from 'redux-form';
import { resetCreatedClusterResponse } from '../../../../redux/actions/clustersActions';
import { getMachineTypes } from '../../../../redux/actions/machineTypesActions';
import { getOrganizationAndQuota } from '../../../../redux/actions/userActions';
import { getCloudProviders } from '../../../../redux/actions/cloudProviderActions';
import CreateROSAWizard from './CreateROSAWizard';
import shouldShowModal from '../../../common/Modal/ModalSelectors';
import { openModal, closeModal } from '../../../common/Modal/ModalActions';
import { hasManagedQuotaSelector } from '../../common/quotaSelectors';
import submitOSDRequest from '../../CreateOSDPage/submitOSDRequest';
import { normalizedProducts } from '../../../../common/subscriptionTypes';

const mapStateToProps = (state) => {
  const { organization } = state.userProfile;
  const valueSelector = formValueSelector('CreateCluster');

  return ({
    isValid: isValid('CreateCluster')(state),
    isErrorModalOpen: shouldShowModal(state, 'osd-create-error'), // TODO: change 'osd' to 'rosa'
    cloudProviderID: 'aws',
    installToVPCSelected: valueSelector(state, 'install_to_vpc'),
    privateLinkSelected: valueSelector(state, 'use_privatelink'),
    createClusterResponse: state.clusters.createdCluster,
    machineTypes: state.machineTypes,
    organization,
    cloudProviders: state.cloudProviders,
    hasProductQuota: hasManagedQuotaSelector(state, normalizedProducts.ROSA),
    getIsTouched: () => {
      // Metadata is only updated when the user interacts with the form,
      // so it is used here to indicate a touched state.
      const formMeta = getFormMeta('CreateCluster')(state);
      return Object.keys(formMeta).length > 0;
    },
  });
};

const mapDispatchToProps = dispatch => ({
  onSubmit: () => dispatch((_, getState) => {
    const formData = getFormValues('CreateCluster')(getState());
    // If changing these params, keep test & DebugClusterRequest props synced.
    const params = { isWizard: true };
    return submitOSDRequest(dispatch, params)(formData); // TODO: change to submitROSARequest(...
  }),
  resetResponse: () => dispatch(resetCreatedClusterResponse()),
  resetForm: () => dispatch(reset('CreateCluster')),
  openModal: (modalName) => { dispatch(openModal(modalName)); },
  closeModal: () => { dispatch(closeModal()); },

  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
  getMachineTypes: () => dispatch(getMachineTypes()),
  getCloudProviders: () => dispatch(getCloudProviders()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateROSAWizard));
