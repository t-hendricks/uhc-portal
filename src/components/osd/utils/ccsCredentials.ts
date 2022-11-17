import { Dispatch } from 'redux';
import { FormikValues } from 'formik';
import isEqual from 'lodash/isEqual';
import {
  getAWSCloudProviderRegions,
  getGCPCloudProviderVPCs,
  VALIDATE_CLOUD_PROVIDER_CREDENTIALS,
} from '~/components/clusters/CreateOSDPage/CreateOSDWizard/ccsInquiriesActions';
import { CloudProviderType } from '../ClusterSettings/CloudProvider/types';
import { FieldId } from '../constants';
import { GlobalState } from '~/redux/store';

export const getCcsCredentials = (values: FormikValues): string | FormikValues | null => {
  const {
    [FieldId.GcpServiceAccount]: gcpServiceAccount,
    [FieldId.AccountId]: accountId,
    [FieldId.AccessKeyId]: accessKeyId,
    [FieldId.SecretAccessKey]: secretAccessKey,
    [FieldId.CloudProvider]: cloudProvider,
  } = values;

  switch (cloudProvider) {
    case CloudProviderType.Gcp:
      return gcpServiceAccount;
    case CloudProviderType.Aws:
      return {
        account_id: accountId,
        access_key_id: accessKeyId,
        secret_access_key: secretAccessKey,
      };
    default:
      return null;
  }
};

export const getCloudProverInfo = (values: FormikValues, dispatch: Dispatch) => {
  const ccsCredentials = getCcsCredentials(values);

  if (values[FieldId.CloudProvider] === CloudProviderType.Gcp) {
    // hard code region since we're just validating credentials
    return dispatch(
      getGCPCloudProviderVPCs(VALIDATE_CLOUD_PROVIDER_CREDENTIALS, ccsCredentials, 'us-east1'),
    );
  }

  return dispatch(getAWSCloudProviderRegions(ccsCredentials));
};

export const shouldValidateCcsCredentials = (
  values: FormikValues,
  ccsCredentialsValidity: GlobalState['ccsInquiries']['ccsCredentialsValidity'],
) => {
  const areCCSCredentialsValid =
    ccsCredentialsValidity.fulfilled &&
    ccsCredentialsValidity.cloudProvider === values[FieldId.CloudProvider] &&
    isEqual(ccsCredentialsValidity.credentials, getCcsCredentials(values));

  return values[FieldId.Byoc] === 'true' && !areCCSCredentialsValid;
};
