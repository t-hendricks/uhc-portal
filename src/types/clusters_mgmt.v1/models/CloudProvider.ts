/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CloudRegion } from './CloudRegion';

/**
 * Cloud provider.
 */
export type CloudProvider = {
  /**
   * Indicates the type of this object. Will be 'CloudProvider' if this is a complete object or 'CloudProviderLink' if it is just a link.
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
   * Name of the cloud provider for display purposes. It can contain any characters,
   * including spaces.
   */
  display_name?: string;
  /**
   * Human friendly identifier of the cloud provider, for example `aws`.
   */
  name?: string;
  /**
   * Region
   */
  regions?: Array<CloudRegion>;
};
