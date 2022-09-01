/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { User } from './User';

/**
 * Representation of a group of users.
 */
export type Group = {
    /**
     * Indicates the type of this object. Will be 'Group' if this is a complete object or 'GroupLink' if it is just a link.
     */
    kind?: string;
    /**
     * Unique identifier of the object.
     */
    id?: string;
    /**
     * Self link.
     */
    href?: string;
    /**
     * List of users of the group.
     */
    users?: Array<User>;
};

