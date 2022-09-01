/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of an product that can be selected as a cluster type.
 */
export type Product = {
    /**
     * Indicates the type of this object. Will be 'Product' if this is a complete object or 'ProductLink' if it is just a link.
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
     * Name of the product.
     */
    name?: string;
};

