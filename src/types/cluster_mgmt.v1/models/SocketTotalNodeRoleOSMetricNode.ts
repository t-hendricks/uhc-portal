/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of information from telemetry about a the socket capacity
 * by node role and OS.
 */
export type SocketTotalNodeRoleOSMetricNode = {
  /**
   * Representation of the node role for a cluster.
   */
  node_roles?: Array<string>;
  /**
   * The operating system.
   */
  operating_system?: string;
  /**
   * The total socket capacity of nodes with this set of roles and operating system.
   */
  socket_total?: number;
  time?: string;
};
