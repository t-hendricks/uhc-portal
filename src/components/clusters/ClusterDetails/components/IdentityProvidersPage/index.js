import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, reset, formValueSelector, getFormSyncErrors } from 'redux-form';
import get from 'lodash/get';
import IdentityProvidersPage from './IdentityProvidersPage';
import {
  createClusterIdentityProvider,
  resetCreatedClusterIDPResponse,
  getClusterIdentityProviders,
  editClusterIdentityProvider,
} from './IdentityProvidersActions';
import { clearGlobalError, setGlobalError } from '../../../../../redux/actions/globalErrorActions';
import { fetchClusterDetails } from '../../../../../redux/actions/clustersActions';

import {
  getCreateIDPRequestData,
  generateIDPName,
  IDPformValues,
  getldapAttributes,
  getOpenIdClaims,
  getGitHubTeamsAndOrgsData,
  IDPObjectNames,
} from './IdentityProvidersHelper';
import { scrollToFirstError } from '../../../../../common/helpers';

const reduxFormConfig = {
  form: 'CreateIdentityProvider',
  enableReinitialize: true,
  onSubmitFail: scrollToFirstError,
};
const reduxFormCreateClusterIDP = reduxForm(reduxFormConfig)(IdentityProvidersPage);
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

const mapStateToProps = (state, ownProps) => {
  let idpEdited = {};
  let editedType = '';
  let selectedIDP = '';
  const valueSelector = formValueSelector('CreateIdentityProvider');
  const errorSelector = getFormSyncErrors('CreateIdentityProvider');
  const clusterIDPs = state.identityProviders.clusterIdentityProviders;
  const clusterIDPList = clusterIDPs.clusterIDPList || [];
  const defaultIDP = IDPformValues.GITHUB;

  const { match, isEditForm } = ownProps;
  if (isEditForm) {
    if (clusterIDPs.fulfilled) {
      idpEdited = clusterIDPList.find((idp) => idp.name === match.params.idpName) || {};
      editedType = get(IDPObjectNames, idpEdited.type, '');
      selectedIDP = idpEdited.type;
    }
  } else {
    selectedIDP = get(IDPformValues, match.params.idpTypeName.toUpperCase(), false);
  }

  return {
    clusterDetails: state.clusters.details,
    clusterID: state.clusters.details.cluster.id,
    selectedIDP,
    submitIDPResponse: isEditForm
      ? state.identityProviders.editClusterIDP
      : state.identityProviders.createdClusterIDP,
    idpEdited,
    editedType,
    isEditForm,
    initialValues: isEditForm
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
        },
    selectedMappingMethod: valueSelector(state, 'mappingMethod'),
    clusterIDPs,
    IDPList: clusterIDPList,
    HTPasswdErrors: get(errorSelector(state), 'users'),
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchDetails: (clusterId) => dispatch(fetchClusterDetails(clusterId)),
  ...bindActionCreators({ clearGlobalError, setGlobalError }, dispatch),
  onSubmit: (formData, clusterID) => {
    const createIdentityProviderRequest = getCreateIDPRequestData(formData);
    if (createIdentityProviderRequest.id) {
      dispatch(editClusterIdentityProvider(clusterID, createIdentityProviderRequest));
    } else {
      dispatch(createClusterIdentityProvider(clusterID, createIdentityProviderRequest));
    }
  },
  resetResponse: () => dispatch(resetCreatedClusterIDPResponse()),
  resetForm: () => dispatch(reset('CreateIdentityProvider')),
  getClusterIDPs: (clusterID) => dispatch(getClusterIdentityProviders(clusterID)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const onSubmit = (formData) => {
    dispatchProps.onSubmit(formData, stateProps.clusterID);
  };
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onSubmit,
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(reduxFormCreateClusterIDP);
