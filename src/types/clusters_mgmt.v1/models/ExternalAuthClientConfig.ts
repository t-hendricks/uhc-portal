/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientComponent } from './ClientComponent';
/**
 * ExternalAuthClientConfig contains configuration for the platform's clients that
 * need to request tokens from the issuer.
 */
export type ExternalAuthClientConfig = {
  /**
   * The identifier of the OIDC client from the OIDC provider.
   */
  id?: string;
  /**
   * The component that is supposed to consume this client configuration.
   */
  component?: ClientComponent;
  /**
   * ExtraScopes is an optional set of scopes to request tokens with.
   */
  extra_scopes?: Array<string>;
  /**
   * The secret of the OIDC client from the OIDC provider.
   */
  secret?: string;
};
