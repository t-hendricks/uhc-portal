/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Overall state of a cluster operator.
 */
export enum ClusterOperatorState {
  AVAILABLE = 'available',
  DEGRADED = 'degraded',
  FAILING = 'failing',
  UPGRADING = 'upgrading',
}
