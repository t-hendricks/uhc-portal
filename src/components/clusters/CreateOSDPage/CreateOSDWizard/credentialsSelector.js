import { formValueSelector } from 'redux-form';

import { normalizedProducts } from '../../../../common/subscriptionTypes';

/**
 * Gets AWS or GCP CCS credentials from form state, in form suitable for actions.
 * In GCP case we return JSON string; parsing it is deferred to action time,
 * when it's easier to present errors to user.
 * TODO: can/should we reuse these in createClusterRequest()?
 *   Note that creation request puts more fields under 'aws' e.g. 'kms_key_arn'.
 */
const ccsCredentialsSelector = (cloudProviderID, state) => {
  const valueSelector = formValueSelector('CreateCluster');
  const product = valueSelector(state, 'product');
  const isROSA = product === normalizedProducts.ROSA;

  switch (cloudProviderID) {
    case 'gcp':
      return valueSelector(state, 'gcp_service_account');
    case 'aws':
      return {
        account_id: valueSelector(state, 'account_id'),
        ...(isROSA
          ? {
              sts: {
                role_arn: valueSelector(state, 'installer_role_arn'),
              },
            }
          : {
              access_key_id: valueSelector(state, 'access_key_id'),
              secret_access_key: valueSelector(state, 'secret_access_key'),
            }),
      };
    default: // can happen before user selected provider
      return null;
  }
};

export default ccsCredentialsSelector;
