import { connect } from 'react-redux';
import {
  reduxForm,
  reset,
  formValueSelector,
  getFormSyncErrors,
} from 'redux-form';
import get from 'lodash/get';
import IdentityProvidersModal from './IdentityProvidersModal';
import {
  createClusterIdentityProvider, resetCreatedClusterIDPResponse, getClusterIdentityProviders,
  editClusterIdentityProvider,
} from './IdentityProvidersActions';
import { closeModal } from '../../../../common/Modal/ModalActions';
import shouldShowModal from '../../../../common/Modal/ModalSelectors';

import {
  getCreateIDPRequestData, generateIDPName, IDPformValues, IDPObjectNames,
  getldapAttributes, getOpenIdClaims, getGitHubTeamsAndOrgsData,
} from './IdentityProvidersHelper';
import { scrollToFirstError } from '../../../../../common/helpers';

const reduxFormConfig = {
  form: 'CreateIdentityProvider',
  enableReinitialize: true,
  onSubmitFail: scrollToFirstError,
};
const reduxFormCreateClusterIDP = reduxForm(reduxFormConfig)(IdentityProvidersModal);
const CLIENT_SECRET = 'CLIENT_SECRET'; // Predefined value
const initialValuesForEditing = (idpEdited, editedType) => ({
  idpId: idpEdited.id,
  type: idpEdited.type,
  name: idpEdited.name,
  client_id: idpEdited[editedType].client_id,
  client_secret: CLIENT_SECRET,
  mappingMethod: idpEdited.mapping_method,
  selectedIDP: idpEdited.type,
  // gitlab
  gitlab_url: idpEdited[editedType].url,
  // openid
  issuer: idpEdited[editedType].issuer,
  openid_name: getOpenIdClaims(idpEdited[editedType].claims, 'name'),
  openid_email: getOpenIdClaims(idpEdited[editedType].claims, 'email'),
  openid_preferred_username: getOpenIdClaims(idpEdited[editedType].claims, 'preferred_username'),
  openid_extra_scopes: idpEdited[editedType].extra_scopes ? idpEdited[editedType].extra_scopes.join() : '',
  // google
  hosted_domain: idpEdited[editedType].hosted_domain,
  // ldap
  ldap_id: getldapAttributes(idpEdited[editedType].attributes, 'id'),
  ldap_preferred_username: getldapAttributes(idpEdited[editedType].attributes, 'preferred_username'),
  ldap_name: getldapAttributes(idpEdited[editedType].attributes, 'name'),
  ldap_email: getldapAttributes(idpEdited[editedType].attributes, 'email'),
  ldap_url: idpEdited[editedType].url,
  bind_dn: idpEdited[editedType].bind_dn,
  bind_password: idpEdited[editedType].bind_dn ? 'BIND_PASSWORD' : '',
  ldap_insecure: idpEdited[editedType].insecure,
  // github
  hostname: idpEdited[editedType].hostname,
  teams: getGitHubTeamsAndOrgsData(idpEdited[editedType]),
  organizations: getGitHubTeamsAndOrgsData(idpEdited[editedType]),
});

const mapStateToProps = (state) => {
  let idpEdited = {};
  let editedType;
  const valueSelector = formValueSelector('CreateIdentityProvider');
  const errorSelector = getFormSyncErrors('CreateIdentityProvider');
  const IDPList = state.identityProviders.clusterIdentityProviders.clusterIDPList || [];
  const defaultIDP = IDPformValues.GITHUB;
  const { isEditForm } = state.modal.data;
  if (isEditForm) {
    idpEdited = IDPList[state.modal.data.rowId];
    editedType = IDPObjectNames[idpEdited.type];
  }
  return ({
    isOpen: shouldShowModal(state, 'create-identity-provider'),
    submitIDPResponse: isEditForm ? state.identityProviders.editClusterIDP
      : state.identityProviders.createdClusterIDP,
    idpEdited,
    isEditForm,
    initialValues: isEditForm ? initialValuesForEditing(idpEdited, editedType) : {
      idpId: null,
      type: defaultIDP,
      name: generateIDPName(defaultIDP, IDPList),
      client_id: '',
      client_secret: '',
      mappingMethod: 'claim',
      selectedIDP: defaultIDP,
      // ldap
      ldap_id: [{ ldap_id: 'dn', id: 'default' }],
      ldap_preferred_username: [{ ldap_preferred_username: 'uid', id: 'default' }],
      ldap_name: [{ ldap_name: 'cn', id: 'default' }],
    },
    selectedIDP: valueSelector(state, 'type') || defaultIDP,
    selectedMappingMethod: valueSelector(state, 'mappingMethod'),
    HTPasswdPasswordErrors: get(errorSelector(state, 'htpasswd_password'), 'htpasswd_password', undefined),
    IDPList,
  });
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: (formData) => {
    const createIdentityProviderRequest = getCreateIDPRequestData(formData);
    if (createIdentityProviderRequest.id) {
      dispatch(editClusterIdentityProvider(ownProps.clusterID, createIdentityProviderRequest));
    } else {
      dispatch(createClusterIdentityProvider(ownProps.clusterID, createIdentityProviderRequest));
    }
  },
  resetResponse: () => dispatch(resetCreatedClusterIDPResponse()),
  closeModal: () => dispatch(closeModal()),
  resetForm: () => dispatch(reset('CreateIdentityProvider')),
  getClusterIdentityProviders: () => dispatch(getClusterIdentityProviders(ownProps.clusterID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormCreateClusterIDP);
