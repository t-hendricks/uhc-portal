/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * GCP Encryption Key for CCS clusters.
 */
export type GCPEncryptionKey = {
  /**
   * Service account used to access the KMS key
   */
  kms_key_service_account?: string;
  /**
   * Location of the encryption key ring
   */
  key_location?: string;
  /**
   * Name of the encryption key
   */
  key_name?: string;
  /**
   * Name of the key ring the encryption key is located on
   */
  key_ring?: string;
};
