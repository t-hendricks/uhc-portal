/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * State of an AWS infrastructure access role grant.
 */
export enum AWSInfrastructureAccessRoleGrantState {
  DELETING = 'deleting',
  FAILED = 'failed',
  PENDING = 'pending',
  READY = 'ready',
  REMOVED = 'removed',
}
