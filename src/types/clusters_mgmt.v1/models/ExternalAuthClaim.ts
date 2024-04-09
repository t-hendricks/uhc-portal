/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TokenClaimMappings } from './TokenClaimMappings';
import type { TokenClaimValidationRule } from './TokenClaimValidationRule';
/**
 * The claims and validation rules used in the configuration of the external authentication.
 */
export type ExternalAuthClaim = {
  /**
   * Mapping describes rules on how to transform information from an ID token into a cluster identity.
   */
  mappings?: TokenClaimMappings;
  /**
   * ValidationRules are rules that are applied to validate token claims to authenticate users.
   */
  validation_rules?: Array<TokenClaimValidationRule>;
};
