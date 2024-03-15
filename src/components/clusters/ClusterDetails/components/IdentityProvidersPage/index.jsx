import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useGlobalState } from '~/redux/hooks';
import { reduxForm, formValueSelector, getFormSyncErrors } from 'redux-form';
import { useParams } from 'react-router-dom-v5-compat';
import get from 'lodash/get';
import IdentityProvidersPage from './IdentityProvidersPage';
import {
  createClusterIdentityProvider,
  editClusterIdentityProvider,
} from './IdentityProvidersActions';
import {
  getCreateIDPRequestData,
  generateIDPName,
  IDPformValues,
  getldapAttributes,
  getOpenIdClaims,
  getGitHubTeamsAndOrgsData,
  IDPObjectNames,
} from './IdentityProvidersHelper';
import { scrollToFirstField } from '../../../../../common/helpers';

export const reduxFormConfig = {
  form: 'CreateIdentityProvider',
  enableReinitialize: true,
  onSubmitFail: scrollToFirstField,
};
const ReduxFormCreateClusterIDP = reduxForm(reduxFormConfig)(IdentityProvidersPage);

const CLIENT_SECRET = 'CLIENT_SECRET'; // Predefined value
const initialValuesForEditing = (idpEdited, editedType) => {
  if (!editedType) {
    return {};
  }
  return {
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
    openid_extra_scopes: idpEdited[editedType].extra_scopes
      ? idpEdited[editedType].extra_scopes.join()
      : '',
    // google
    hosted_domain: idpEdited[editedType].hosted_domain,
    // ldap
    ldap_id: getldapAttributes(idpEdited[editedType].attributes, 'id'),
    ldap_preferred_username: getldapAttributes(
      idpEdited[editedType].attributes,
      'preferred_username',
    ),
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
  };
};

const ReduxFormCreateClusterIDPWrapper = (props) => {
  const params = useParams();
  const dispatch = useDispatch();
  const state = useGlobalState((state) => state);

  const { isEditForm } = props;

  const valueSelector = formValueSelector('CreateIdentityProvider');
  const errorSelector = getFormSyncErrors('CreateIdentityProvider');

  const clusterID = useGlobalState((state) => state.clusters.details.cluster.id);
  const clusterDetails = useGlobalState((state) => state.clusters.details);
  const editClusterIDP = useGlobalState((state) => state.identityProviders.editClusterIDP);
  const createdClusterIDP = useGlobalState((state) => state.identityProviders.createdClusterIDP);

  const clusterIDPs = useGlobalState((state) => state.identityProviders.clusterIdentityProviders);
  const submitIDPResponse = isEditForm ? editClusterIDP : createdClusterIDP;

  let idpEdited = {};
  let editedType = '';
  let selectedIDP = '';

  const clusterIDPList = clusterIDPs.clusterIDPList || [];
  const defaultIDP = IDPformValues.GITHUB;

  if (isEditForm) {
    if (clusterIDPs.fulfilled) {
      idpEdited = clusterIDPList.find((idp) => idp.name === params.idpName) || {};
      editedType = get(IDPObjectNames, idpEdited.type, '');
      selectedIDP = idpEdited.type;
    }
  } else if (!isEditForm && params.idpTypeName) {
    selectedIDP = get(IDPformValues, params.idpTypeName.toUpperCase(), false);
  }

  // initialValues are for redux-form initialization and has to be passed through the component
  // eslint-disable-next-line no-unused-vars
  const initialValues = isEditForm
    ? initialValuesForEditing(idpEdited, editedType)
    : {
        idpId: null,
        type: selectedIDP || defaultIDP,
        name: generateIDPName(selectedIDP || defaultIDP, clusterIDPList),
        client_id: '',
        client_secret: '',
        mappingMethod: 'claim',
        selectedIDP: selectedIDP || defaultIDP,
        // ldap
        ldap_id: [{ ldap_id: 'dn', id: 'default' }],
        ldap_preferred_username: [{ ldap_preferred_username: 'uid', id: 'default' }],
        ldap_name: [{ ldap_name: 'cn', id: 'default' }],
      };

  // redux-form passthrough props
  // eslint-disable-next-line no-unused-vars
  const selectedMappingMethod = valueSelector(state, 'mappingMethod');
  const HTPasswdErrors = get(errorSelector(state), 'users');

  const onSubmit = (formData) => {
    const createIdentityProviderRequest = getCreateIDPRequestData(formData);
    if (createIdentityProviderRequest.id) {
      dispatch(editClusterIdentityProvider(clusterID, createIdentityProviderRequest));
    } else {
      dispatch(createClusterIdentityProvider(clusterID, createIdentityProviderRequest));
    }
  };

  return (
    <ReduxFormCreateClusterIDP
      clusterID={clusterID}
      IDPList={clusterIDPList}
      HTPasswdErrors={HTPasswdErrors}
      clusterIDPs={clusterIDPs}
      clusterIDPList={clusterIDPList}
      isEditForm={isEditForm}
      idpEdited={idpEdited}
      editedType={editedType}
      selectedIDP={selectedIDP}
      initialValues={initialValues}
      selectedMappingMethod={selectedMappingMethod}
      onSubmit={onSubmit}
      submitIDPResponse={submitIDPResponse}
      clusterDetails={clusterDetails}
      {...props}
    />
  );
};

ReduxFormCreateClusterIDPWrapper.propTypes = {
  isEditForm: PropTypes.bool,
};

export default ReduxFormCreateClusterIDPWrapper;
