/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * State of an inflight check.
 */
export enum InflightCheckState {
  FAILED = 'failed',
  PASSED = 'passed',
  PENDING = 'pending',
  RUNNING = 'running',
}
