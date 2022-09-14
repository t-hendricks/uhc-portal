/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { disk_config_params } from './disk_config_params';
import type { node_label_params } from './node_label_params';

export type host_update_params = {
    disks_selected_config?: Array<disk_config_params> | null;
    host_name?: string | null;
    host_role?: host_update_params.host_role | null;
    /**
     * A string which will be used as Authorization Bearer token to fetch the ignition from ignition_endpoint_url.
     */
    ignition_endpoint_token?: string | null;
    machine_config_pool_name?: string | null;
    /**
     * Labels to be added to the corresponding node.
     */
    node_labels?: Array<node_label_params> | null;
};

export namespace host_update_params {

    export enum host_role {
        AUTO_ASSIGN = 'auto-assign',
        MASTER = 'master',
        WORKER = 'worker',
    }


}

