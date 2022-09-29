/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type route = {
  /**
   * The destination network or destination host
   */
  destination?: string;
  /**
   * Defines whether this is an IPv4 (4) or IPv6 route (6)
   */
  family?: number;
  /**
   * Gateway address where the packets are sent
   */
  gateway?: string;
  /**
   * Interface to which packets for this route will be sent
   */
  interface?: string;
};
