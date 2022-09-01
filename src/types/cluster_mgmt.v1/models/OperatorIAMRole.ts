/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Contains the necessary attributes to allow each operator to access the necessary AWS resources
 */
export type OperatorIAMRole = {
    /**
     * Randomly-generated ID to identify the operator role
     */
    id?: string;
    /**
     * Name of the credentials secret used to access cloud resources
     */
    name?: string;
    /**
     * Namespace where the credentials secret lives in the cluster
     */
    namespace?: string;
    /**
     * Role to assume when accessing AWS resources
     */
    role_arn?: string;
    /**
     * Service account name to use when authenticating
     */
    service_account?: string;
};

