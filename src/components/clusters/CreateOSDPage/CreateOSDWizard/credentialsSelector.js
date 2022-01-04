import { formValueSelector } from 'redux-form';

/**
 * Gets AWS or GCP CCS credentials from form state, in form suitable for actions.
 * TODO: consider moving credentialsFromJSON() here, change actions to take object rather than JSON?
 * TODO: can/should we reuse these in createClusterRequest()?
 *   Note that creation request puts more fields under 'aws' e.g. 'kms_key_arn'.
 */

const ccsCredentialsSelector = (state) => {
  const valueSelector = formValueSelector('CreateCluster');
  const cloudProviderID = valueSelector(state, 'cloud_provider'); // TODO: ROSA has no such field!
  switch (cloudProviderID) {
    case 'gcp':
      return valueSelector(state, 'gcp_service_account');
    case 'aws':
      return {
        access_key_id: valueSelector(state, 'access_key_id'),
        account_id: valueSelector(state, 'account_id'),
        secret_access_key: valueSelector(state, 'secret_access_key'),
      };
    default: // can happen before user selected provider
      return null;
  }
};

export default ccsCredentialsSelector;
