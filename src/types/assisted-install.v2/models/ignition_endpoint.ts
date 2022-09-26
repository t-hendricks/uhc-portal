/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Explicit ignition endpoint overrides the default ignition endpoint.
 */
export type ignition_endpoint = {
  /**
   * base64 encoded CA certficate to be used when contacting the URL via https.
   */
  ca_certificate?: string | null;
  /**
   * The URL for the ignition endpoint.
   */
  url?: string | null;
};
