/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type disk_encryption = {
    /**
     * Enable/disable disk encryption on master nodes, worker nodes, or all nodes.
     */
    enable_on?: disk_encryption.enable_on;
    /**
     * The disk encryption mode to use.
     */
    mode?: disk_encryption.mode;
    /**
     * JSON-formatted string containing additional information regarding tang's configuration
     */
    tang_servers?: string;
};

export namespace disk_encryption {

    /**
     * Enable/disable disk encryption on master nodes, worker nodes, or all nodes.
     */
    export enum enable_on {
        NONE = 'none',
        ALL = 'all',
        MASTERS = 'masters',
        WORKERS = 'workers',
    }

    /**
     * The disk encryption mode to use.
     */
    export enum mode {
        TPMV2 = 'tpmv2',
        TANG = 'tang',
    }


}

