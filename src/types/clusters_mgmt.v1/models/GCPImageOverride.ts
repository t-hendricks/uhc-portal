/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BillingModelItem } from './BillingModelItem';
import type { Product } from './Product';

/**
 * GcpImageOverride specifies what a GCP VM Image should be used for a particular product and billing model
 */
export type GCPImageOverride = {
  /**
   * Indicates the type of this object. Will be 'GCPImageOverride' if this is a complete object or 'GCPImageOverrideLink' if it is just a link.
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
   * Link to the billing model.
   */
  billing_model?: BillingModelItem;
  /**
   * ImageID is the id of the Google Cloud Platform image.
   */
  image_id?: string;
  /**
   * Link to the product type.
   */
  product?: Product;
  /**
   * ProjectID is the id of the Google Cloud Platform project that hosts the image.
   */
  project_id?: string;
};
