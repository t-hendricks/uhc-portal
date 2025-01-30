/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Contains the necessary attributes to support oidc configuration thumbprint operations such as fetching/creation of a thumbprint
 */
export type OidcThumbprint = {
  /**
   * HREF for the oidc config thumbprint, filled in response.
   */
  href?: string;
  /**
   * ClusterId is the for the cluster used, filled in response.
   */
  cluster_id?: string;
  /**
   * Kind is the resource type, filled in response.
   */
  kind?: string;
  /**
   * OidcConfigId is the ID for the oidc config used, filled in response.
   */
  oidc_config_id?: string;
  /**
   * Thumbprint is the thumbprint itself, filled in response.
   */
  thumbprint?: string;
};
