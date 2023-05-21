import pick from 'lodash/pick';
import { action, ActionType } from 'typesafe-actions';
import { GCP } from '~/types/clusters_mgmt.v1';
import { AWSCredentials } from '~/types/types';
import {
  listAWSVPCs,
  listGCPVPCs,
  listGCPKeyRings,
  listGCPKeys,
  listAWSRegions,
} from '../../../../services/clusterService';

export const VALIDATE_CLOUD_PROVIDER_CREDENTIALS = 'VALIDATE_CLOUD_PROVIDER_CREDENTIALS';
export const LIST_VPCS = 'LIST_VPCS';
export const LIST_REGIONS = 'LIST_REGIONS';
export const LIST_GCP_KEY_RINGS = 'LIST_GCP_KEY_RINGS';
export const LIST_GCP_KEYS = 'LIST_GCP_KEYS';
export const CLEAR_LIST_VPCS = 'CLEAR_LIST_VPCS';
export const CLEAR_ALL_CLOUD_PROVIDER_INQUIRIES = 'CLEAR_ALL_CLOUD_PROVIDER_INQUIRIES';
export const CLEAR_CCS_CREDENTIALS_INQUIRY = 'CLEAR_CCS_CREDENTIALS_INQUIRY';

// Made async to ease handling of JSON SyntaxError as action rejection.
const credentialsFromJSON = async (gcpCredentialsJSON: string): Promise<GCP> => {
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
 * Optimization: If `subnet` is provided, only VPC attached to that subnet id will be included.
 */
export const getAWSCloudProviderVPCs = (
  awsCredentials: AWSCredentials,
  region: string,
  subnet?: string,
) =>
  action(
    LIST_VPCS,
    listAWSVPCs(awsCredentials, region, subnet),
    // parameters can be used to check if we need to query again.
    {
      credentials: awsCredentials,
      cloudProvider: 'aws',
      region,
      subnet,
    },
  );

export const getGCPCloudProviderVPCs = (
  type: 'VALIDATE_CLOUD_PROVIDER_CREDENTIALS' | 'LIST_VPCS',
  gcpCredentialsJSON: string,
  region: string,
) =>
  action(
    type,
    credentialsFromJSON(gcpCredentialsJSON).then((creds) => listGCPVPCs(creds, region)),
    // parameters can be used to check if we need to query again.
    {
      credentials: gcpCredentialsJSON,
      cloudProvider: 'gcp',
      region,
      subnet: undefined,
    },
  );

/**
 * List regions, also used as a way to validate AWS credentials.
 * TODO (SDA-8744): backend allows wrong `account_id`.
 * @param {Object} credentials
 * @param {string} [openshiftVersionId] Optional. Exclude regions known to be incompatible
 *   with this version.
 */
export const getAWSCloudProviderRegions = (
  type: 'VALIDATE_CLOUD_PROVIDER_CREDENTIALS' | 'LIST_REGIONS',
  awsCredentials: AWSCredentials,
  openshiftVersionId?: string,
) =>
  action(
    type,
    listAWSRegions(awsCredentials, openshiftVersionId),
    // meta parameters can be used to check if we need to query again.
    {
      credentials: awsCredentials,
      cloudProvider: 'aws',
      openshiftVersionId,
    },
  );

export const getGCPKeyRings = (gcpCredentialsJSON: string, keyLocation: string) =>
  action(
    LIST_GCP_KEY_RINGS,
    credentialsFromJSON(gcpCredentialsJSON).then((creds) => listGCPKeyRings(creds, keyLocation)),
    // parameters can be used to check if we need to query again.
    {
      credentials: gcpCredentialsJSON,
      keyLocation,
      cloudProvider: 'gcp',
    },
  );

export const getGCPKeys = (gcpCredentialsJSON: string, keyLocation: string, keyRing: string) =>
  action(
    LIST_GCP_KEYS,
    credentialsFromJSON(gcpCredentialsJSON).then((creds) =>
      listGCPKeys(creds, keyLocation, keyRing),
    ),
    // parameters can be used to check if we need to query again.
    {
      credentials: gcpCredentialsJSON,
      keyLocation,
      keyRing,
      cloudProvider: 'gcp',
    },
  );

export const clearAllCloudProviderInquiries = () => action(CLEAR_ALL_CLOUD_PROVIDER_INQUIRIES);

export const clearCcsCredientialsInquiry = () => action(CLEAR_CCS_CREDENTIALS_INQUIRY);

export const clearListVpcs = () => action(CLEAR_LIST_VPCS);

export type InquiriesAction = ActionType<
  | typeof getAWSCloudProviderVPCs
  | typeof getGCPCloudProviderVPCs
  | typeof getAWSCloudProviderRegions
  | typeof getGCPKeyRings
  | typeof getGCPKeys
  | typeof clearAllCloudProviderInquiries
  | typeof clearCcsCredientialsInquiry
  | typeof clearListVpcs
>;
