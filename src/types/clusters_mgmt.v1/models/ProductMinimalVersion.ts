/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Representation of a product minimal version.
 */
export type ProductMinimalVersion = {
  /**
   * Indicates the type of this object. Will be 'ProductMinimalVersion' if this is a complete object or 'ProductMinimalVersionLink' if it is just a link.
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
   * The ROSA CLI minimal version.
   */
  rosa_cli?: string;
  /**
   * The start date for this minimal version.
   */
  start_date?: string;
};
