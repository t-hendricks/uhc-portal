/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of an add-on env object.
 */
export type AddOnEnvironmentVariable = {
  /**
   * Indicates the type of this object. Will be 'AddOnEnvironmentVariable' if this is a complete object or 'AddOnEnvironmentVariableLink' if it is just a link.
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
   * Name of the env object.
   */
  name?: string;
  /**
   * Value of the env object.
   */
  value?: string;
};
