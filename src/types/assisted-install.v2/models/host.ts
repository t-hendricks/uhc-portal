/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { host_progress_info } from './host_progress_info';
import type { host_role } from './host_role';
import type { host_stage } from './host_stage';
import type { logs_state } from './logs_state';

export type host = {
    api_vip_connectivity?: string;
    bootstrap?: boolean;
    /**
     * The last time the host's agent communicated with the service.
     */
    checked_in_at?: string;
    /**
     * The cluster that this host is associated with.
     */
    cluster_id?: string | null;
    connectivity?: string;
    created_at?: string;
    /**
     * swagger:ignore
     */
    deleted_at?: any;
    discovery_agent_version?: string;
    /**
     * Additional information about disks, formatted as JSON.
     */
    disks_info?: string;
    /**
     * The domain name resolution result.
     */
    domain_name_resolutions?: string;
    free_addresses?: string;
    /**
     * Self link.
     */
    href: string;
    /**
     * Unique identifier of the object.
     */
    id: string;
    /**
     * Json formatted string containing the user overrides for the host's pointer ignition
     */
    ignition_config_overrides?: string;
    /**
     * True if the token to fetch the ignition from ignition_endpoint_url is set.
     */
    ignition_endpoint_token_set?: boolean;
    /**
     * Array of image statuses.
     */
    images_status?: string;
    /**
     * The infra-env that this host is associated with.
     */
    infra_env_id?: string;
    /**
     * Contains the inventory disk id to install on.
     */
    installation_disk_id?: string;
    /**
     * Contains the inventory disk path, This field is replaced by installation_disk_id field and used for backward compatability with the old UI.
     */
    installation_disk_path?: string;
    installer_args?: string;
    /**
     * Installer version.
     */
    installer_version?: string;
    inventory?: string;
    /**
     * Indicates the type of this object. Will be 'Host' if this is a complete object or 'HostLink' if it is just a link, or
     * 'AddToExistingClusterHost' for host being added to existing OCP cluster, or
     *
     */
    kind: host.kind;
    logs_collected_at?: string;
    /**
     * The progress of log collection or empty if logs are not applicable
     */
    logs_info?: logs_state;
    logs_started_at?: string;
    machine_config_pool_name?: string;
    media_status?: host.media_status | null;
    /**
     * Json containing node's labels.
     */
    node_labels?: string;
    /**
     * The configured NTP sources on the host.
     */
    ntp_sources?: string;
    progress?: host_progress_info;
    progress_stages?: Array<host_stage>;
    requested_hostname?: string;
    role?: host_role;
    /**
     * Time at which the current progress stage started.
     */
    stage_started_at?: string;
    /**
     * Time at which the current progress stage was last updated.
     */
    stage_updated_at?: string;
    status: host.status;
    status_info: string;
    /**
     * The last time that the host status was updated.
     */
    status_updated_at?: string;
    suggested_role?: host_role;
    updated_at?: string;
    user_name?: string;
    /**
     * JSON-formatted string containing the validation results for each validation id grouped by category (network, hardware, etc.)
     */
    validations_info?: string;
};

export namespace host {

    /**
     * Indicates the type of this object. Will be 'Host' if this is a complete object or 'HostLink' if it is just a link, or
     * 'AddToExistingClusterHost' for host being added to existing OCP cluster, or
     *
     */
    export enum kind {
        HOST = 'Host',
        ADD_TO_EXISTING_CLUSTER_HOST = 'AddToExistingClusterHost',
    }

    export enum media_status {
        CONNECTED = 'connected',
        DISCONNECTED = 'disconnected',
    }

    export enum status {
        DISCOVERING = 'discovering',
        KNOWN = 'known',
        DISCONNECTED = 'disconnected',
        INSUFFICIENT = 'insufficient',
        DISABLED = 'disabled',
        PREPARING_FOR_INSTALLATION = 'preparing-for-installation',
        PREPARING_FAILED = 'preparing-failed',
        PREPARING_SUCCESSFUL = 'preparing-successful',
        PENDING_FOR_INPUT = 'pending-for-input',
        INSTALLING = 'installing',
        INSTALLING_IN_PROGRESS = 'installing-in-progress',
        INSTALLING_PENDING_USER_ACTION = 'installing-pending-user-action',
        RESETTING_PENDING_USER_ACTION = 'resetting-pending-user-action',
        INSTALLED = 'installed',
        ERROR = 'error',
        RESETTING = 'resetting',
        ADDED_TO_EXISTING_CLUSTER = 'added-to-existing-cluster',
        CANCELLED = 'cancelled',
        BINDING = 'binding',
        UNBINDING = 'unbinding',
        UNBINDING_PENDING_USER_ACTION = 'unbinding-pending-user-action',
        KNOWN_UNBOUND = 'known-unbound',
        DISCONNECTED_UNBOUND = 'disconnected-unbound',
        INSUFFICIENT_UNBOUND = 'insufficient-unbound',
        DISABLED_UNBOUND = 'disabled-unbound',
        DISCOVERING_UNBOUND = 'discovering-unbound',
    }


}

