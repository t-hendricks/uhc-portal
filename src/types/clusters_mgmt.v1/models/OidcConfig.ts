/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Contains the necessary attributes to support oidc configuration hosting under Red Hat or registering a Customer's byo oidc config.
 */
export type OidcConfig = {
  /**
   * HREF for the oidc config, filled in response.
   */
  href?: string;
  /**
   * ID for the oidc config, filled in response.
   */
  id?: string;
  /**
   * Creation timestamp, filled in response.
   */
  creation_timestamp?: string;
  /**
   * ARN of the AWS role to assume when installing the cluster as to reveal the secret, supplied in request. It is only to be used in Unmanaged Oidc Config.
   */
  installer_role_arn?: string;
  /**
   * Issuer URL, filled in response when Managed and supplied in Unmanaged.
   */
  issuer_url?: string;
  /**
   * Last update timestamp, filled when patching a valid attribute of this oidc config.
   */
  last_update_timestamp?: string;
  /**
   * Last used timestamp, filled by the latest cluster that used this oidc config.
   */
  last_used_timestamp?: string;
  /**
   * Indicates whether it is Managed or Unmanaged (Customer hosted).
   */
  managed?: boolean;
  /**
   * Organization ID, filled in response respecting token provided.
   */
  organization_id?: string;
  /**
   * Indicates whether the Oidc Config can be reused.
   */
  reusable?: boolean;
  /**
   * Secrets Manager ARN for the OIDC private key, supplied in request. It is only to be used in Unmanaged Oidc Config.
   */
  secret_arn?: string;
};
