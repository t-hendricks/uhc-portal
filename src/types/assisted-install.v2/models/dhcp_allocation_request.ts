/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type dhcp_allocation_request = {
  /**
   * Contents of lease file to be used for API virtual IP.
   */
  api_vip_lease?: string;
  /**
   * MAC address for the API virtual IP.
   */
  api_vip_mac: string;
  /**
   * Contents of lease file to be used for for Ingress virtual IP.
   */
  ingress_vip_lease?: string;
  /**
   * MAC address for the Ingress virtual IP.
   */
  ingress_vip_mac: string;
  /**
   * The network interface (NIC) to run the DHCP requests on.
   */
  interface: string;
};
