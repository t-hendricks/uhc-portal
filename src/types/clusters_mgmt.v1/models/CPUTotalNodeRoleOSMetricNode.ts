/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of information from telemetry about a the CPU capacity by node role and OS.
 */
export type CPUTotalNodeRoleOSMetricNode = {
  /**
   * The total CPU capacity of nodes with this set of roles and operating system.
   */
  cpu_total?: number;
  /**
   * Representation of the node role for a cluster.
   */
  node_roles?: Array<string>;
  /**
   * The operating system.
   */
  operating_system?: string;
  time?: string;
};
