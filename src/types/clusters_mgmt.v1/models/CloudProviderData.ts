/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AWS } from './AWS';
import type { CloudRegion } from './CloudRegion';
import type { GCP } from './GCP';
import type { Version } from './Version';

/**
 * Description of a cloud provider data used for cloud provider inquiries.
 */
export type CloudProviderData = {
  /**
   * Amazon Web Services settings.
   */
  aws?: AWS;
  /**
   * Google cloud platform settings.
   */
  gcp?: GCP;
  /**
   * Availability zone
   */
  availability_zones?: Array<string>;
  /**
   * Key location
   */
  key_location?: string;
  /**
   * Key ring name
   */
  key_ring_name?: string;
  /**
   * Region
   */
  region?: CloudRegion;
  /**
   * Subnets
   */
  subnets?: Array<string>;
  /**
   * Openshift version
   */
  version?: Version;
};
