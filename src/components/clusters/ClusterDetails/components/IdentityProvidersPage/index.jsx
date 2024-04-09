import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom-v5-compat';
import { formValueSelector, getFormSyncErrors, reduxForm } from 'redux-form';

import { useGlobalState } from '~/redux/hooks';

import { scrollToFirstField } from '../../../../../common/helpers';

import {
  createClusterIdentityProvider,
  editClusterIdentityProvider,
} from './IdentityProvidersActions';
import {
  generateIDPName,
  getCreateIDPRequestData,
  getInitialValuesForEditing,
  IDPformValues,
  IDPObjectNames,
} from './IdentityProvidersHelper';
import IdentityProvidersPage from './IdentityProvidersPage';

export const reduxFormConfig = {
  form: 'CreateIdentityProvider',
  enableReinitialize: true,
  onSubmitFail: scrollToFirstField,
};
const ReduxFormCreateClusterIDP = reduxForm(reduxFormConfig)(IdentityProvidersPage);

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
  const initialValues = isEditForm
    ? getInitialValuesForEditing(idpEdited, editedType)
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
