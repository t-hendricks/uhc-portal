/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CloudProvider } from './CloudProvider';
/**
 * RegistryAllowlist represents a single registry allowlist.
 */
export type RegistryAllowlist = {
  /**
   * Indicates the type of this object. Will be 'RegistryAllowlist' if this is a complete object or 'RegistryAllowlistLink' if it is just a link.
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
   * CloudProvider is the cloud provider for which this allowlist is valid.
   */
  cloud_provider?: CloudProvider;
  /**
   * CreationTimestamp is the date and time when the allow list has been created.
   */
  creation_timestamp?: string;
  /**
   * Registries is the list of registries contained in this Allowlist.
   */
  registries?: Array<string>;
};
