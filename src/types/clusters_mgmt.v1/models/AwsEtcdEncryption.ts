/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Contains the necessary attributes to support etcd encryption for AWS based clusters.
 */
export type AwsEtcdEncryption = {
  /**
   * ARN of the KMS to be used for the etcd encryption
   */
  kms_key_arn?: string;
};
