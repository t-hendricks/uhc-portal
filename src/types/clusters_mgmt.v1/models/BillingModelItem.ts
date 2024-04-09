/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * BillingModelItem represents a billing model
 */
export type BillingModelItem = {
  /**
   * Indicates the type of this object. Will be 'BillingModelItem' if this is a complete object or 'BillingModelItemLink' if it is just a link.
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
   * BillingModelType is the type of the BillingModel. e.g. standard, marketplace.
   */
  billing_model_type?: string;
  /**
   * Single line description of the billing model.
   */
  description?: string;
  /**
   * User friendly display name of the billing model.
   */
  display_name?: string;
  /**
   * Indicates the marketplace of the billing model. e.g. gcp, aws, etc.
   */
  marketplace?: string;
};
