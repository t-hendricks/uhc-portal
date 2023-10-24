/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CloudRegion } from './CloudRegion';
import type { Product } from './Product';

/**
 * AMIOverride specifies what Amazon Machine Image should be used for a particular product and region.
 */
export type AMIOverride = {
  /**
   * Indicates the type of this object. Will be 'AMIOverride' if this is a complete object or 'AMIOverrideLink' if it is just a link.
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
   * AMI is the id of the Amazon Machine Image.
   */
  ami?: string;
  /**
   * Link to the product type.
   */
  product?: Product;
  /**
   * Link to the cloud provider region.
   */
  region?: CloudRegion;
};
