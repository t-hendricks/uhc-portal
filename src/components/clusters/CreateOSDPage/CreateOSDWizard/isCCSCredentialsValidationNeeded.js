import isEqual from 'lodash/isEqual';
import { formValueSelector } from 'redux-form';

import ccsCredentialsSelector from './credentialsSelector';

/**
 * Returns true when validation is needed for CCS credentials.
 *
 * @param {String} cloudProviderID (separate since only OSD wizard has 'cloud_provider' field)
 * @param {*} state redux state
 * @returns {Boolean} is validation needed for CCS credentials
 */
const isCCSCredentialsValidationNeeded = (cloudProviderID, state) => {
  const valueSelector = formValueSelector('CreateCluster');
  const ccsCredentialsValidityResponse = state.ccsInquiries.ccsCredentialsValidity;
  // credentials is a "key" to check the response we have matches the currently entered details.
  // if the details change, we need to run validations again.
  const credentialsKey = ccsCredentialsSelector(cloudProviderID, state);

  const areCCSCredentialsValid =
    ccsCredentialsValidityResponse.fulfilled &&
    ccsCredentialsValidityResponse.cloudProvider === cloudProviderID &&
    isEqual(ccsCredentialsValidityResponse.credentials, credentialsKey);

  return valueSelector(state, 'byoc') === 'true' && !areCCSCredentialsValid;
};

export default isCCSCredentialsValidationNeeded;
