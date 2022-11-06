/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of an add-on installation parameter.
 */
export type AddOnInstallationParameter = {
  /**
   * Indicates the type of this object. Will be 'AddOnInstallationParameter' if this is a complete object or 'AddOnInstallationParameterLink' if it is just a link.
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
   * Value of the parameter.
   */
  value?: string;
};
