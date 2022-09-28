import pick from 'lodash/pick';
import {
  listAWSVPCs,
  listGCPVPCs,
  listGCPKeyRings,
  listGCPKeys,
  listAWSRegions,
} from '../../../../services/clusterService';

export const VALIDATE_CLOUD_PROVIDER_CREDENTIALS = 'VALIDATE_CLOUD_PROVIDER_CREDENTIALS';
export const LIST_VPCS = 'LIST_VPCS';
export const LIST_GCP_KEY_RINGS = 'LIST_GCP_KEY_RINGS';
export const LIST_GCP_KEYS = 'LIST_GCP_KEYS';
export const CLEAR_ALL_CLOUD_PROVIDER_INQUIRIES = 'CLEAR_ALL_CLOUD_PROVIDER_INQUIRIES';
export const CLEAR_CCS_CREDENTIALS_INQUIRY = 'CLEAR_CCS_CREDENTIALS_INQUIRY';

// Made async to ease handling of JSON SyntaxError as action rejection.
const credentialsFromJSON = async (gcpCredentialsJSON) => {
  const parsedCredentials = JSON.parse(gcpCredentialsJSON);
  return pick(parsedCredentials, [
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
};

/**
 * List AWS VPCs for given CCS account.
 * @param {*} awsCredentials { accountID, accessKey, secretKey } object
 */
export const getAWSCloudProviderVPCs = (awsCredentials, region) => ({
  type: LIST_VPCS,
  payload: listAWSVPCs(awsCredentials, region),
  // parameters can be used to check if we need to query again.
  meta: {
    credentials: awsCredentials,
    cloudProvider: 'aws',
    region,
  },
});

export const getGCPCloudProviderVPCs = (type, gcpCredentialsJSON, region) => ({
  type,
  payload: () =>
    credentialsFromJSON(gcpCredentialsJSON).then((creds) => listGCPVPCs(creds, region)),
  // parameters can be used to check if we need to query again.
  meta: { credentials: gcpCredentialsJSON, cloudProvider: 'gcp', region },
});

/**
 * Validate AWS credentials.
 * @param {*} awsCredentials { accountID, accessKey, secretKey } object
 */
export const getAWSCloudProviderRegions = (awsCredentials) => ({
  type: VALIDATE_CLOUD_PROVIDER_CREDENTIALS,
  payload: listAWSRegions(awsCredentials),
  meta: {
    credentials: awsCredentials,
    cloudProvider: 'aws',
  },
});

export const getGCPKeyRings = (gcpCredentialsJSON, keyLocation) => ({
  type: LIST_GCP_KEY_RINGS,
  payload: () =>
    credentialsFromJSON(gcpCredentialsJSON).then((creds) => listGCPKeyRings(creds, keyLocation)),
  // parameters can be used to check if we need to query again.
  meta: {
    credentials: gcpCredentialsJSON,
    keyLocation,
    cloudProvider: 'gcp',
  },
});

export const getGCPKeys = (gcpCredentialsJSON, keyLocation, keyRing) => ({
  type: LIST_GCP_KEYS,
  payload: () =>
    credentialsFromJSON(gcpCredentialsJSON).then((creds) =>
      listGCPKeys(creds, keyLocation, keyRing),
    ),
  // parameters can be used to check if we need to query again.
  meta: {
    credentials: gcpCredentialsJSON,
    keyLocation,
    keyRing,
    cloudProvider: 'gcp',
  },
});

export const clearAllCloudProviderInquiries = () => ({
  type: CLEAR_ALL_CLOUD_PROVIDER_INQUIRIES,
});

export const clearCcsCredientialsInquiry = () => ({
  type: CLEAR_CCS_CREDENTIALS_INQUIRY,
});
