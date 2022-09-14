/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Type of identity provider.
 */
export enum IdentityProviderType {
    LDAPIDENTITY_PROVIDER = 'LDAPIdentityProvider',
    GITHUB_IDENTITY_PROVIDER = 'GithubIdentityProvider',
    GITLAB_IDENTITY_PROVIDER = 'GitlabIdentityProvider',
    GOOGLE_IDENTITY_PROVIDER = 'GoogleIdentityProvider',
    HTPASSWD_IDENTITY_PROVIDER = 'HTPasswdIdentityProvider',
    OPEN_IDIDENTITY_PROVIDER = 'OpenIDIdentityProvider',
}
