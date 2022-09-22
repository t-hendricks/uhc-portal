/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ClusterConfigurationMode } from './ClusterConfigurationMode';
import type { ClusterState } from './ClusterState';

/**
 * Detailed status of a cluster.
 */
export type ClusterStatus = {
    /**
     * Indicates the type of this object. Will be 'ClusterStatus' if this is a complete object or 'ClusterStatusLink' if it is just a link.
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
     * DNSReady from Provisioner
     */
    dns_ready?: boolean;
    /**
     * OIDCReady from user configuration.
     */
    oidc_ready?: boolean;
    /**
     * Configuration mode
     */
    configuration_mode?: ClusterConfigurationMode;
    /**
     * Detailed description of the cluster status.
     */
    description?: string;
    /**
     * Limited Support Reason Count
     */
    limited_support_reason_count?: number;
    /**
     * Provisioning Error Code
     */
    provision_error_code?: string;
    /**
     * Provisioning Error Message
     */
    provision_error_message?: string;
    /**
     * The overall state of the cluster.
     */
    state?: ClusterState;
};

