/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type api_vip_connectivity_request = {
  /**
   * A CA certficate to be used when contacting the URL via https.
   */
  ca_certificate?: string | null;
  /**
   * A string which will be used as Authorization Bearer token to fetch the ignition from ignition_endpoint_url.
   */
  ignition_endpoint_token?: string | null;
  /**
   * URL address of the API.
   */
  url: string;
  /**
   * Whether to verify if the API VIP belongs to one of the interfaces (DEPRECATED).
   */
  verify_cidr?: boolean;
};
