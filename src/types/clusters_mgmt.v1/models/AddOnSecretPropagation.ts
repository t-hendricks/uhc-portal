/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of an addon secret propagation
 */
export type AddOnSecretPropagation = {
  /**
   * ID of the secret propagation
   */
  id?: string;
  /**
   * DestinationSecret is location of the secret to be added
   */
  destination_secret?: string;
  /**
   * Indicates is this secret propagation is enabled for the addon
   */
  enabled?: boolean;
  /**
   * SourceSecret is location of the source secret
   */
  source_secret?: string;
};
