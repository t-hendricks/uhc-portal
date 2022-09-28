/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AddOnEnvironmentVariable } from './AddOnEnvironmentVariable';

/**
 * Representation of an add-on config.
 * The attributes under it are to be used by the addon once its installed in the cluster.
 */
export type AddOnConfig = {
  /**
   * Indicates the type of this object. Will be 'AddOnConfig' if this is a complete object or 'AddOnConfigLink' if it is just a link.
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
   * List of environment variables for the addon
   */
  add_on_environment_variables?: Array<AddOnEnvironmentVariable>;
};
