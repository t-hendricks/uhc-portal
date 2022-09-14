/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Contains the necessary attributes to allow each operator to access the necessary AWS resources
 */
export type CredentialRequest = {
    /**
     * Name of the credentials secret used to access cloud resources
     */
    name?: string;
    /**
     * Namespace where the credentials secret lives in the cluster
     */
    namespace?: string;
    /**
     * List of policy permissions needed to access cloud resources
     */
    policy_permissions?: Array<string>;
    /**
     * Service account name to use when authenticating
     */
    service_account?: string;
};

