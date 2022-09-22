/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Log of the cluster.
 */
export type Log = {
    /**
     * Indicates the type of this object. Will be 'Log' if this is a complete object or 'LogLink' if it is just a link.
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
     * Content of the log.
     */
    content?: string;
};

