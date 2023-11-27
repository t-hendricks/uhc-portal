/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AMIOverride } from './AMIOverride';
import type { GCPImageOverride } from './GCPImageOverride';

/**
 * ImageOverrides holds the lists of available images per cloud provider.
 */
export type ImageOverrides = {
  /**
   * Indicates the type of this object. Will be 'ImageOverrides' if this is a complete object or 'ImageOverridesLink' if it is just a link.
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
  aws?: Array<AMIOverride>;
  gcp?: Array<GCPImageOverride>;
};
