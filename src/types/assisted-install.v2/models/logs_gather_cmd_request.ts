/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type logs_gather_cmd_request = {
    /**
     * Host is bootstrap or not
     */
    bootstrap: boolean;
    /**
     * Cluster id
     */
    cluster_id: string;
    /**
     * Host id
     */
    host_id: string;
    /**
     * Infra env id
     */
    infra_env_id: string;
    /**
     * Run installer gather logs
     */
    installer_gather: boolean;
    /**
     * List of master ips
     */
    master_ips?: Array<string>;
};

