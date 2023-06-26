/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of a tuning config.
 */
export type TuningConfig = {
  /**
   * Indicates the type of this object. Will be 'TuningConfig' if this is a complete object or 'TuningConfigLink' if it is just a link.
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
   * Name of the tuning config.
   */
  name?: string;
  /**
   * Spec of the tuning config.
   */
  spec?: any;
};
