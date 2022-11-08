/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of an addon catalog source object used by addon versions.
 */
export type AdditionalCatalogSource = {
  /**
   * ID of the additional catalog source
   */
  id?: string;
  /**
   * Indicates is this additional catalog source is enabled for the addon
   */
  enabled?: boolean;
  /**
   * Image of the additional catalog source.
   */
  image?: string;
  /**
   * Name of the additional catalog source.
   */
  name?: string;
};
