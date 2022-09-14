/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Error = {
    /**
     * Indicates the type of this object. Will always be 'Error'
     */
    kind?: string;
    /**
     * Numeric identifier of the error.
     */
    id?: number;
    /**
     * Self link.
     */
    href?: string;
    /**
     * Globally unique code of the error, composed of the unique identifier of the API and the numeric identifier of the error. For example, for if the numeric identifier of the error is `93` and the identifier of the API is `clusters_mgmt` then the code will be `CLUSTERS-MGMT-93`.
     */
    code?: string;
    /**
     * Human readable description of the error.
     */
    reason?: string;
    /**
     * Extra information about the error.
     */
    details?: any;
};

