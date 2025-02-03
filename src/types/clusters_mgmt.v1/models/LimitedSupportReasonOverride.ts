/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Representation of the limited support reason override.
 */
export type LimitedSupportReasonOverride = {
  /**
   * Indicates the type of this object. Will be 'LimitedSupportReasonOverride' if this is a complete object or 'LimitedSupportReasonOverrideLink' if it is just a link.
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
   * Indicates if the override is enabled
   */
  enabled?: boolean;
};
