/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of a product technology preview.
 */
export type ProductTechnologyPreview = {
  /**
   * Indicates the type of this object. Will be 'ProductTechnologyPreview' if this is a complete object or 'ProductTechnologyPreviewLink' if it is just a link.
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
   * Message associated with this technology preview.
   */
  additional_text?: string;
  /**
   * The end date for this technology preview.
   */
  end_date?: string;
  /**
   * The start date for this technology preview.
   */
  start_date?: string;
};
