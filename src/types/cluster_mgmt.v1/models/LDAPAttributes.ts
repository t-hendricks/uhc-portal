/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * LDAP attributes used to configure the LDAP identity provider.
 */
export type LDAPAttributes = {
  /**
   * List of attributes to use as the identity.
   */
  id?: Array<string>;
  /**
   * List of attributes to use as the mail address.
   */
  email?: Array<string>;
  /**
   * List of attributes to use as the display name.
   */
  name?: Array<string>;
  /**
   * List of attributes to use as the preferred user name when provisioning a user.
   */
  preferred_username?: Array<string>;
};
