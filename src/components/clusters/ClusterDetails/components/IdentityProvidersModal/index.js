import { connect } from 'react-redux';
import { reduxForm, reset, formValueSelector } from 'redux-form';

import IdentityProvidersModal from './IdentityProvidersModal';
import { createClusterIdentityProvider, resetCreatedClusterIDPResponse, getClusterIdentityProviders } from './IdentityProvidersActions';
import { closeModal } from '../../../../common/Modal/ModalActions';
import shouldShowModal from '../../../../common/Modal/ModalSelectors';

import getCreateIDPRequestData from './IdentityProvidersHelper';

const reduxFormConfig = {
  form: 'CreateIdentityProvider',
};
const reduxFormCreateCluster = reduxForm(reduxFormConfig)(IdentityProvidersModal);

const valueSelector = formValueSelector('CreateIdentityProvider');

const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'create-identity-provider'),
  createIDPResponse: state.identityProviders.createdClusterIDP,
  clusterName: state.modal.activeModal.data.clusterName,
  initialValues: {
    type: 'GithubIdentityProvider',
    client_id: '',
    client_secret: '',
    mappingMethod: 'claim',
  },
  selectedIDP: valueSelector(state, 'type') || 'GithubIdentityProvider',
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: (formData) => {
    const createIdentityProviderRequest = getCreateIDPRequestData(formData);
    dispatch(createClusterIdentityProvider(ownProps.clusterID, createIdentityProviderRequest));
  },
  resetResponse: () => dispatch(resetCreatedClusterIDPResponse()),
  closeModal: () => dispatch(closeModal()),
  resetForm: () => dispatch(reset('CreateIdentityProvider')),
  getClusterIdentityProviders: () => dispatch(getClusterIdentityProviders(ownProps.clusterID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormCreateCluster);
