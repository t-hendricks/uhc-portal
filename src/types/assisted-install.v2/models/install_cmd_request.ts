/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { host_role } from './host_role';
import type { proxy } from './proxy';

export type install_cmd_request = {
    /**
     * Boot device to write image on
     */
    boot_device: string;
    /**
     * Check CVO status if needed
     */
    check_cvo?: boolean;
    /**
     * Cluster id
     */
    cluster_id: string;
    /**
     * Assisted installer controller image
     */
    controller_image: string;
    /**
     * List of disks to format
     */
    disks_to_format?: Array<string>;
    /**
     * Guaranteed availability of the installed cluster. 'Full' installs a Highly-Available cluster
     * over multiple master nodes whereas 'None' installs a full cluster over one node.
     *
     */
    high_availability_mode?: install_cmd_request.high_availability_mode;
    /**
     * Host id
     */
    host_id: string;
    /**
     * Infra env id
     */
    infra_env_id: string;
    /**
     * Core-os installer addtional args
     */
    installer_args?: string;
    /**
     * Assisted installer image
     */
    installer_image: string;
    /**
     * Machine config operator image
     */
    mco_image?: string;
    /**
     * Must-gather images to use
     */
    must_gather_image?: string;
    /**
     * Version of the OpenShift cluster.
     */
    openshift_version?: string;
    proxy?: proxy;
    role: host_role;
    /**
     * List of service ips
     */
    service_ips?: Array<string>;
};

export namespace install_cmd_request {

    /**
     * Guaranteed availability of the installed cluster. 'Full' installs a Highly-Available cluster
     * over multiple master nodes whereas 'None' installs a full cluster over one node.
     *
     */
    export enum high_availability_mode {
        FULL = 'Full',
        NONE = 'None',
    }


}

