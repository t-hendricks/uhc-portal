/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The username claim mapping.
 */
export type UsernameClaim = {
  /**
   * The claim used in the token.
   */
  claim?: string;
  /**
   * A prefix contatenated in the claim (Optional).
   */
  prefix?: string;
  /**
   * PrefixPolicy specifies how a prefix should apply.
   *
   * By default, claims other than `email` will be prefixed with the issuer URL to
   * prevent naming clashes with other plugins.
   *
   * Set to "NoPrefix" to disable prefixing.
   */
  prefix_policy?: string;
};
