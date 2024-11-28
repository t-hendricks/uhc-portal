/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Contains the necessary attributes to fetch an OIDC Configuration thumbprint
 */
export type OidcThumbprintInput = {
  /**
   * ClusterId is the for the cluster used, exclusive from OidcConfigId.
   */
  cluster_id?: string;
  /**
   * OidcConfigId is the ID for the oidc config used, exclusive from ClusterId.
   */
  oidc_config_id?: string;
};
