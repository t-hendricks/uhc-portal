/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Description of a cloud provider encryption key.
 */
export type EncryptionKey = {
    /**
     * Indicates the type of this object. Will be 'EncryptionKey' if this is a complete object or 'EncryptionKeyLink' if it is just a link.
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
     * Name of the encryption key.
     */
    name?: string;
};

