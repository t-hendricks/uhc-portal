/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SocketTotalNodeRoleOSMetricNode } from './SocketTotalNodeRoleOSMetricNode';

/**
 * Representation of information from telemetry about the socket capacity by node
 * role and OS of a cluster.
 */
export type SocketTotalsNodeRoleOSMetricNode = {
  socket_totals?: Array<SocketTotalNodeRoleOSMetricNode>;
};
