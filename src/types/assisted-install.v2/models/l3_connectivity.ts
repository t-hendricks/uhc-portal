/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type l3_connectivity = {
  /**
   * Average round trip time in milliseconds.
   */
  average_rtt_ms?: number;
  outgoing_nic?: string;
  /**
   * Percentage of packets lost during connectivity check.
   */
  packet_loss_percentage?: number;
  remote_ip_address?: string;
  successful?: boolean;
};
