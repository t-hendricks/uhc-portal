/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Contains the necessary attributes to support role-based authentication on AWS.
 */
export type InstanceIAMRoles = {
    /**
     * The IAM role ARN that will be attached to master instances
     */
    master_role_arn?: string;
    /**
     * The IAM role ARN that will be attached to worker instances
     */
    worker_role_arn?: string;
};

