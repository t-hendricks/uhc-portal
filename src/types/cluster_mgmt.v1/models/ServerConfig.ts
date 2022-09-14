/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of a server config
 */
export type ServerConfig = {
    /**
     * Indicates the type of this object. Will be 'ServerConfig' if this is a complete object or 'ServerConfigLink' if it is just a link.
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
     * The URL of the server
     */
    server?: string;
};

