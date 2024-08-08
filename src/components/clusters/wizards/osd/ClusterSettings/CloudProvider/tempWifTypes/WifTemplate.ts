/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WifServiceAccount } from './WifServiceAccount';
/**
 * Definition of an wif_template resource.
 */
export type WifTemplate = {
  /**
   * Indicates the type of this object. Will be 'WifTemplate' if this is a complete object or 'WifTemplateLink' if it is just a link.
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
   * The list of service accounts and their associated roles that this template
   * would require to be configured on the user's GCP project.
   */
  service_accounts?: Array<WifServiceAccount>;
};
