import pick from 'lodash/pick';
import { listGCPVPCs, listAWSRegions } from '../../../../services/clusterService';

export const VALIDATE_CLOUD_PROVIDER_CREDENTIALS = 'GET_CCS_CLOUD_PROVIDER_VPCS';
export const CLEAR_ALL_CLOUD_PROVIDER_INQUIRIES = 'CLEAR_ALL_CLOUD_PROVIDER_INQUIRIES';

export const getGCPCloudProviderVPCs = gcpCredentials => dispatch => dispatch({
  type: VALIDATE_CLOUD_PROVIDER_CREDENTIALS,
  payload: () => {
    const parsedCredentials = JSON.parse(gcpCredentials);
    const sanitizedCredentials = pick(parsedCredentials, [
      'type',
      'project_id',
      'private_key_id',
      'private_key',
      'client_email',
      'client_id',
      'auth_uri',
      'token_uri',
      'auth_provider_x509_cert_url',
      'client_x509_cert_url',
    ]);
    return listGCPVPCs(sanitizedCredentials, 'us-east1').then(
      // return both response and credentials string.
      // credential string can be used to check if we need to query again.
      response => ({ response, credentials: gcpCredentials, cloudProvider: 'gcp' }),
    );
  },
});

export const getAWSCloudProviderRegions = (accountID,
  accessKey, secretKey) => dispatch => dispatch({
  type: VALIDATE_CLOUD_PROVIDER_CREDENTIALS,
  payload: listAWSRegions(accountID, accessKey, secretKey).then(response => ({
    response,
    credentials: `${accountID}/${accessKey}/${secretKey}`,
    cloudProvider: 'aws',
  })),
});

export const clearAllCloudProviderInquiries = () => ({
  type: CLEAR_ALL_CLOUD_PROVIDER_INQUIRIES,
});
