/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrganizationLink } from './OrganizationLink';
import type { WifGcp } from './WifGcp';
/**
 * Definition of an wif_config resource.
 */
export type WifConfig = {
  /**
   * Indicates the type of this object. Will be 'WifConfig' if this is a complete object or 'WifConfigLink' if it is just a link.
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
   * The name OCM clients will display for this wif_config.
   */
  display_name?: string;
  /**
   * Holds GCP related data.
   */
  gcp?: WifGcp;
  /**
   * The OCM organization that this wif_config resource belongs to.
   */
  organization?: OrganizationLink;
  /**
   * Wif template(s) used to configure IAM resources
   */
  wif_templates?: Array<string>;
};
