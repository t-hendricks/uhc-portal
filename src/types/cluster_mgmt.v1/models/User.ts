/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of a user.
 */
export type User = {
    /**
     * Indicates the type of this object. Will be 'User' if this is a complete object or 'UserLink' if it is just a link.
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
};

