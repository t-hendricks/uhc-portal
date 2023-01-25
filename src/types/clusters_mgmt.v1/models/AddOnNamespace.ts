/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AddOnNamespace = {
  /**
   * Indicates the type of this object. Will be 'AddOnNamespace' if this is a complete object or 'AddOnNamespaceLink' if it is just a link.
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
   * Annotations to be applied to this namespace.
   */
  annotations?: Record<string, string>;
  /**
   * Labels to be applied to this namespace.
   */
  labels?: Record<string, string>;
  /**
   * Name of the namespace.
   */
  name?: string;
};
