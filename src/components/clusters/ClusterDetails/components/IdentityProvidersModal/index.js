import { connect } from 'react-redux';
import { reduxForm, reset, formValueSelector } from 'redux-form';

import IdentityProvidersModal from './IdentityProvidersModal';
import { createClusterIdentityProvider, resetCreatedClusterIDPResponse, getClusterIdentityProviders } from './IdentityProvidersActions';
import { closeModal } from '../../../../common/Modal/ModalActions';
import shouldShowModal from '../../../../common/Modal/ModalSelectors';

import { getCreateIDPRequestData, generateIDPName, IDPformValues } from './IdentityProvidersHelper';

const reduxFormConfig = {
  form: 'CreateIdentityProvider',
};
const reduxFormCreateClusterIDP = reduxForm(reduxFormConfig)(IdentityProvidersModal);

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('CreateIdentityProvider');
  const IDPList = state.identityProviders.clusterIdentityProviders.clusterIDPList || [];
  const defaultIDP = IDPformValues.GITHUB;

  return ({
    isOpen: shouldShowModal(state, 'create-identity-provider'),
    createIDPResponse: state.identityProviders.createdClusterIDP,
    initialValues: {
      type: defaultIDP,
      name: generateIDPName(defaultIDP, IDPList),
      client_id: '',
      client_secret: '',
      mappingMethod: 'claim',
      ldap_id: [{ ldap_id: 'dn', id: 'default' }],
      ldap_preferred_username: [{ ldap_preferred_username: 'uid', id: 'default' }],
      ldap_name: [{ ldap_name: 'cn', id: 'default' }],
    },
    selectedIDP: valueSelector(state, 'type') || defaultIDP,
    selectedMappingMethod: valueSelector(state, 'mappingMethod'),
    IDPList,
  });
};

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

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormCreateClusterIDP);
