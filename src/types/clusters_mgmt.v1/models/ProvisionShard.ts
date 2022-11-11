/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CloudProvider } from './CloudProvider';
import type { CloudRegion } from './CloudRegion';
import type { ServerConfig } from './ServerConfig';

/**
 * Contains the properties of the provision shard, including AWS and GCP related configurations
 */
export type ProvisionShard = {
  /**
   * Indicates the type of this object. Will be 'ProvisionShard' if this is a complete object or 'ProvisionShardLink' if it is just a link.
   */
  kind?: string;
  /**
   * Unique identifier of the object.
   */
  id?: string;
  /**
   * Self link.
   */
  href?: string;
  /**
   * Contains the configuration for the AWS account operator.
   */
  aws_account_operator_config?: ServerConfig;
  /**
   * Contains the AWS base domain.
   */
  aws_base_domain?: string;
  /**
   * Contains the GCP base domain.
   */
  gcp_base_domain?: string;
  /**
   * Contains the configuration for the GCP project operator.
   */
  gcp_project_operator?: ServerConfig;
  /**
   * Contains the cloud provider name.
   */
  cloud_provider?: CloudProvider;
  /**
   * Date and time when the provision shard was initially created, using the
   * format defined in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt).
   */
  creation_timestamp?: string;
  /**
   * Contains the configuration for Hive.
   */
  hive_config?: ServerConfig;
  /**
   * Contains the configuration for Hypershift.
   */
  hypershift_config?: ServerConfig;
  /**
   * Date and time when the provision shard was last updated, using the
   * format defined in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt).
   */
  last_update_timestamp?: string;
  /**
   * Contains the name of the management cluster for Hypershift clusters that are assigned to this shard.
   * This field is populated by OCM, and must not be overwritten via API.
   */
  management_cluster?: string;
  /**
   * Contains the cloud-provider region in which the provisioner spins up the cluster.
   */
  region?: CloudRegion;
  /**
   * Status of the provision shard. Possible values: active/maintenance/offline.
   */
  status?: string;
};
