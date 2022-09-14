/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of an sts operator
 */
export type STSOperator = {
    /**
     * Maximum ocp version supported
     */
    max_version?: string;
    /**
     * Minimum ocp version supported
     */
    min_version?: string;
    /**
     * Operator Name
     */
    name?: string;
    /**
     * Operator Namespace
     */
    namespace?: string;
    /**
     * Service Accounts
     */
    service_accounts?: Array<string>;
};

