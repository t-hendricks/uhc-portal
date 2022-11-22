/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CloudProvider } from './CloudProvider';

/**
 * Description of a region of a cloud provider.
 */
export type CloudRegion = {
  /**
   * Indicates the type of this object. Will be 'CloudRegion' if this is a complete object or 'CloudRegionLink' if it is just a link.
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
   * 'true' if the region is supported only for CCS clusters, 'false' otherwise.
   */
  ccs_only?: boolean;
  /**
   * Link to the cloud provider that the region belongs to.
   */
  cloud_provider?: CloudProvider;
  /**
   * Name of the region for display purposes, for example `N. Virginia`.
   */
  display_name?: string;
  /**
   * Whether the region is enabled for deploying an OSD cluster.
   */
  enabled?: boolean;
  /**
   * Human friendly identifier of the region, for example `us-east-1`.
   *
   * NOTE: Currently for all cloud providers and all regions `id` and `name` have exactly
   * the same values.
   */
  name?: string;
  /**
   * Whether the region supports multiple availability zones.
   */
  supports_multi_az?: boolean;
  /**
   * kms_location_name
   */
  kms_location_name?: string;
  /**
   * kms_location_id
   */
  kms_location_id?: string;
};
