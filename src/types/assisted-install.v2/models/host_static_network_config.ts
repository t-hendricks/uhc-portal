/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { mac_interface_map } from './mac_interface_map';

export type host_static_network_config = {
  /**
   * mapping of host macs to logical interfaces used in the network yaml
   */
  mac_interface_map?: mac_interface_map;
  /**
   * yaml string that can be processed by nmstate
   */
  network_yaml?: string;
};
