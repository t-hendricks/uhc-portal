/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Description of a cloud provider key ring.
 */
export type KeyRing = {
    /**
     * Indicates the type of this object. Will be 'KeyRing' if this is a complete object or 'KeyRingLink' if it is just a link.
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
     * Name of the key ring.
     */
    name?: string;
};

