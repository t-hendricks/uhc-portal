/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * SSH key pair of a cluster.
 */
export type SSHCredentials = {
    /**
     * SSH private key of the cluster.
     */
    private_key?: string;
    /**
     * SSH public key of the cluster.
     */
    public_key?: string;
};

