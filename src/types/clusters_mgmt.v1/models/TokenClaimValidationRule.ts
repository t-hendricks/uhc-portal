/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The rule that is applied to validate token claims to authenticate users.
 */
export type TokenClaimValidationRule = {
  /**
   * Claim is a name of a required claim.
   */
  claim?: string;
  /**
   * RequiredValue is the required value for the claim.
   */
  required_value?: string;
};
