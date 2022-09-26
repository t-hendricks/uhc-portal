/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type dhcp_allocation_response = {
  /**
   * The IPv4 address that was allocated by DHCP for the API virtual IP.
   */
  api_vip_address: string;
  /**
   * Contents of last acquired lease for API virtual IP.
   */
  api_vip_lease?: string;
  /**
   * The IPv4 address that was allocated by DHCP for the Ingress virtual IP.
   */
  ingress_vip_address: string;
  /**
   * Contents of last acquired lease for Ingress virtual IP.
   */
  ingress_vip_lease?: string;
};
