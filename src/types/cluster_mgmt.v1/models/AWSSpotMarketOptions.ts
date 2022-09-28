/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Spot market options for AWS machine pool.
 */
export type AWSSpotMarketOptions = {
  /**
   * Indicates the type of this object. Will be 'AWSSpotMarketOptions' if this is a complete object or 'AWSSpotMarketOptionsLink' if it is just a link.
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
   * The max price for spot instance. Optional.
   * If not set, use the on-demand price.
   */
  max_price?: number;
};
