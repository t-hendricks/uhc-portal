/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AuditLog } from './AuditLog';
import type { AwsEtcdEncryption } from './AwsEtcdEncryption';
import type { Ec2MetadataHttpTokens } from './Ec2MetadataHttpTokens';
import type { PrivateLinkClusterConfiguration } from './PrivateLinkClusterConfiguration';
import type { STS } from './STS';

/**
 * _Amazon Web Services_ specific settings of a cluster.
 */
export type AWS = {
  /**
   * Customer Managed Key to encrypt EBS Volume
   */
  kms_key_arn?: string;
  /**
   * Contains the necessary attributes to support role-based authentication on AWS.
   */
  sts?: STS;
  /**
   * AWS access key identifier.
   */
  access_key_id?: string;
  /**
   * AWS account identifier.
   */
  account_id?: string;
  /**
   * Audit log forwarding configuration
   */
  audit_log?: AuditLog;
  /**
   * BillingAccountID is the account used for billing subscriptions purchased via the marketplace
   */
  billing_account_id?: string;
  /**
   * Which Ec2MetadataHttpTokens to use for metadata service interaction options for EC2 instances
   */
  ec2_metadata_http_tokens?: Ec2MetadataHttpTokens;
  /**
   * Related etcd encryption configuration
   */
  etcd_encryption?: AwsEtcdEncryption;
  /**
   * ID of private hosted zone.
   */
  private_hosted_zone_id?: string;
  /**
   * Role ARN for private hosted zone.
   */
  private_hosted_zone_role_arn?: string;
  /**
   * Sets cluster to be inaccessible externally.
   */
  private_link?: boolean;
  /**
   * Manages additional configuration for Private Links.
   */
  private_link_configuration?: PrivateLinkClusterConfiguration;
  /**
   * AWS secret access key.
   */
  secret_access_key?: string;
  /**
   * The subnet ids to be used when installing the cluster.
   */
  subnet_ids?: Array<string>;
  /**
   * Optional keys and values that the installer will add as tags to all AWS resources it creates
   */
  tags?: Record<string, string>;
};
