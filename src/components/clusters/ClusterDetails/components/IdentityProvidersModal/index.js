import { connect } from 'react-redux';
import { reduxForm, reset } from 'redux-form';
import result from 'lodash/result';

import IdentityProvidersModal from './IdentityProvidersModal';
import { createClusterIdentityProvider, resetCreatedClusterIDPResponse, getClusterIdentityProviders } from './IdentityProvidersActions';
import { closeModal } from '../../../../common/Modal/ModalActions';
import shouldShowModal from '../../../../common/Modal/ModalSelectors';

import { omitEmptyFields, toCleanArray } from '../../../../../common/helpers';

const reduxFormConfig = {
  form: 'CreateIdentityProvider',
};
const reduxFormCreateCluster = reduxForm(reduxFormConfig)(IdentityProvidersModal);

const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'create-identity-provider'),
  createIDPResponse: state.identityProviders.createdClusterIDP,
  clusterName: state.modal.activeModal.data.clusterName,
  initialValues: {
    type: 'GithubIdentityProvider',
    client_id: '',
    client_secret: '',
    github: undefined,
  },
  mappingMethod: 'claim',
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: (formData) => {
    const createIdentityProviderRequest = {
      type: formData.type,
      name: formData.name,
      login: formData.login,
      challenge: formData.challenge,
      mappingMethod: formData.mappingMethod || 'claim',
      github: {
        client_id: formData.client_id,
        client_secret: formData.client_secret,
        hostname: formData.hostname,
        organizations: result(formData, 'organizations', false)
          ? toCleanArray(formData.organizations) : undefined,
        teams: result(formData, 'teams', false) ? toCleanArray(formData.teams) : undefined,
      },
    };
    dispatch(
      createClusterIdentityProvider(
        ownProps.clusterID, omitEmptyFields(createIdentityProviderRequest),
      ),
    );
  },
  resetResponse: () => dispatch(resetCreatedClusterIDPResponse()),
  closeModal: () => dispatch(closeModal()),
  resetForm: () => dispatch(reset('CreateIdentityProvider')),
  getClusterIdentityProviders: () => dispatch(getClusterIdentityProviders(ownProps.clusterID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormCreateCluster);
