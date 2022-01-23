import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  isValid, reset, formValueSelector, getFormValues,
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
  });
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: () => dispatch((_, getState) => {
    const formData = getFormValues('CreateCluster')(getState());
    return submitOSDRequest(dispatch, ownProps)(formData); // TODO: change to submitROSARequest(...
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
