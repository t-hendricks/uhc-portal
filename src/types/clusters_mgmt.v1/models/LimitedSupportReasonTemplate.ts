/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A template for cluster limited support reason.
 */
export type LimitedSupportReasonTemplate = {
  /**
   * Indicates the type of this object. Will be 'LimitedSupportReasonTemplate' if this is a complete object or 'LimitedSupportReasonTemplateLink' if it is just a link.
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
   * URL with a link to a detailed description of the reason.
   */
  details?: string;
  /**
   * Summary of the reason.
   */
  summary?: string;
};
