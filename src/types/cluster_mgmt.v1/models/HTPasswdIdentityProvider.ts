/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HTPasswdUser } from './HTPasswdUser';

/**
 * Details for `htpasswd` identity providers.
 */
export type HTPasswdIdentityProvider = {
    /**
     * Password to be used in the _HTPasswd_ data file.
     */
    password?: string;
    /**
     * Username to be used in the _HTPasswd_ data file.
     */
    username?: string;
    /**
     * Link to the collection of _HTPasswd_ users.
     */
    users?: Array<HTPasswdUser>;
};

