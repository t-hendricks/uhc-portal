/**
 * Returns true when validation is needed for CCS credentials.
 *
 * @param {*} state redux state
 * @param {*} valueSelector redux-form valueSelector
 * @returns {Boolean} is validation needed for CCS credentials
 */
const isCCSCredentialsValidationNeeded = (state, valueSelector) => {
  const ccsCredentialsValidityResponse = state.ccsInquiries.ccsCredentialsValidity;
  // credentials is a "key" to check the response we have matches the currently entered details.
  // if the details change, we need to run validations again.
  const credentialsKey = valueSelector(state, 'cloud_provider') === 'gcp'
    ? valueSelector(state, 'gcp_service_account')
    : `${valueSelector(state, 'account_id')}/${valueSelector(state, 'access_key_id')}/${valueSelector(state, 'secret_access_key')}`;

  const areCCSCredentialsValid = ccsCredentialsValidityResponse.fulfilled
                                 && ccsCredentialsValidityResponse.cloudProvider === valueSelector(state, 'cloud_provider')
                                 && ccsCredentialsValidityResponse.credentials === credentialsKey;

  return valueSelector(state, 'byoc') === 'true' && !areCCSCredentialsValid;
};

export default isCCSCredentialsValidationNeeded;
