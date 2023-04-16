import { Dispatch } from 'redux';
import { FormikValues } from 'formik';
import isEqual from 'lodash/isEqual';

import { GlobalState } from '~/redux/store';
import {
  getAWSCloudProviderRegions,
  getGCPCloudProviderVPCs,
  VALIDATE_CLOUD_PROVIDER_CREDENTIALS,
} from '~/components/clusters/CreateOSDPage/CreateOSDWizard/ccsInquiriesActions';
import { CloudProviderType } from '~/components/clusters/wizards/common/constants';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import { AWSCredentials } from '~/types/types';

/**
 * Gets AWS CCS credentials from form state, in form suitable for actions.
 */
export const getAwsCcsCredentials = (values: FormikValues): AWSCredentials => {
  const {
    [FieldId.AccountId]: accountId,
    [FieldId.AccessKeyId]: accessKeyId,
    [FieldId.SecretAccessKey]: secretAccessKey,
  } = values;

  // TODO: handle STS
  return {
    account_id: accountId,
    access_key_id: accessKeyId,
    secret_access_key: secretAccessKey,
  };
};

/**
 * Gets GCP CCS credentials from form state, in form suitable for actions.
 * We return JSON string; parsing it is deferred to action time,
 * when it's easier to present errors to user.
 */
export const getGcpCcsCredentials = (values: FormikValues): string => {
  const { [FieldId.GcpServiceAccount]: gcpServiceAccount } = values;

  return gcpServiceAccount;
};

export const getCloudProverInfo = (values: FormikValues, dispatch: Dispatch) => {
  if (values[FieldId.CloudProvider] === CloudProviderType.Gcp) {
    // hard code region since we're just validating credentials
    return dispatch(
      getGCPCloudProviderVPCs(
        VALIDATE_CLOUD_PROVIDER_CREDENTIALS,
        getGcpCcsCredentials(values),
        'us-east1',
      ),
    );
  }
  return dispatch(getAWSCloudProviderRegions(getAwsCcsCredentials(values)));
};

export const shouldValidateCcsCredentials = (
  values: FormikValues,
  ccsCredentialsValidity: GlobalState['ccsInquiries']['ccsCredentialsValidity'],
) => {
  const areCCSCredentialsValid =
    ccsCredentialsValidity.fulfilled &&
    ccsCredentialsValidity.cloudProvider === values[FieldId.CloudProvider] &&
    isEqual(
      ccsCredentialsValidity.credentials,
      values[FieldId.CloudProvider] === CloudProviderType.Aws
        ? getAwsCcsCredentials(values)
        : getGcpCcsCredentials(values),
    );

  return values[FieldId.Byoc] === 'true' && !areCCSCredentialsValid;
};
