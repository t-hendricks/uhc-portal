/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Status of the break glass credential.
 */
export enum BreakGlassCredentialStatus {
  AWAITING_REVOCATION = 'awaiting_revocation',
  CREATED = 'created',
  EXPIRED = 'expired',
  FAILED = 'failed',
  ISSUED = 'issued',
  REVOKED = 'revoked',
}
