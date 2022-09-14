/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type mac_interface_map = Array<{
    /**
     * nic name used in the yaml, which relates 1:1 to the mac address
     */
    logical_nic_name?: string;
    /**
     * mac address present on the host
     */
    mac_address?: string;
}>;
