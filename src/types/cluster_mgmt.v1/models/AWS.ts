/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { STS } from './STS';

/**
 * _Amazon Web Services_ specific settings of a cluster.
 */
export type AWS = {
    /**
     * Customer Managed Key to encrypt EBS Volume
     */
    kms_key_arn?: string;
    /**
     * Contains the necessary attributes to support role-based authentication on AWS.
     */
    sts?: STS;
    /**
     * AWS access key identifier.
     */
    access_key_id?: string;
    /**
     * AWS account identifier.
     */
    account_id?: string;
    /**
     * Sets cluster to be inaccessible externally.
     */
    private_link?: boolean;
    /**
     * AWS secret access key.
     */
    secret_access_key?: string;
    /**
     * The subnet ids to be used when installing the cluster.
     */
    subnet_ids?: Array<string>;
    /**
     * Optional keys and values that the installer will add as tags to all AWS resources it creates
     */
    tags?: Record<string, string>;
};

