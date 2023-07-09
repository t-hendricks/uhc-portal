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
   * (GCP only) Comma-separated list of KMS location IDs that can be used with this region.
   * E.g. "global,nam4,us". Order is not guaranteed.
   */
  kms_location_id?: string;
  /**
   * (GCP only) Comma-separated list of display names corresponding to KMSLocationID.
   * E.g. "Global,nam4 (Iowa, South Carolina, and Oklahoma),US". Order is not guaranteed but will match KMSLocationID.
   * Unfortunately, this API doesn't allow robust splitting - Contact ocm-feedback@redhat.com if you want to rely on this.
   */
  kms_location_name?: string;
  /**
   * Link to the cloud provider that the region belongs to.
   */
  cloud_provider?: CloudProvider;
  /**
   * Name of the region for display purposes, for example `N. Virginia`.
   */
  display_name?: string;
  /**
   * Whether the region is enabled for deploying a managed cluster.
   */
  enabled?: boolean;
  /**
   * Whether the region is an AWS GovCloud region.
   */
  govcloud?: boolean;
  /**
   * Human friendly identifier of the region, for example `us-east-1`.
   *
   * NOTE: Currently for all cloud providers and all regions `id` and `name` have exactly
   * the same values.
   */
  name?: string;
  /**
   * 'true' if the region is supported for Hypershift deployments, 'false' otherwise.
   */
  supports_hypershift?: boolean;
  /**
   * Whether the region supports multiple availability zones.
   */
  supports_multi_az?: boolean;
};
