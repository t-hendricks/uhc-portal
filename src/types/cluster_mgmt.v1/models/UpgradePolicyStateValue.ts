/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Overall state of a cluster upgrade policy.
 */
export enum UpgradePolicyStateValue {
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  DELAYED = 'delayed',
  FAILED = 'failed',
  PENDING = 'pending',
  SCHEDULED = 'scheduled',
  STARTED = 'started',
}
