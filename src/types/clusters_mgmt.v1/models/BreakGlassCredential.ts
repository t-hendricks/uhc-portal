/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BreakGlassCredentialStatus } from './BreakGlassCredentialStatus';
/**
 * Representation of a break glass credential.
 */
export type BreakGlassCredential = {
  /**
   * Indicates the type of this object. Will be 'BreakGlassCredential' if this is a complete object or 'BreakGlassCredentialLink' if it is just a link.
   */
  kind?: string;
  /**
   * Unique identifier of the object.
   */
  id?: string;
  /**
   * Self link.
   */
  href?: string;
  /**
   * ExpirationTimestamp is the date and time when the credential will expire.
   */
  expiration_timestamp?: string;
  /**
   * Kubeconfig is the generated kubeconfig for this credential. It is only stored in memory
   */
  kubeconfig?: string;
  /**
   * RevocationTimestamp is the date and time when the credential has been revoked.
   */
  revocation_timestamp?: string;
  /**
   * Status is the status of this credential
   */
  status?: BreakGlassCredentialStatus;
  /**
   * Username is the user which will be used for this credential.
   */
  username?: string;
};
