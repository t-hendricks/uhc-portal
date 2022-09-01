/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReservedResource } from './ReservedResource';

export type ClusterAuthorizationRequest = {
    account_username: string;
    availability_zone?: string;
    byoc?: boolean;
    cloud_account_id?: string;
    cloud_provider_id?: string;
    cluster_id: string;
    disconnected?: boolean;
    display_name?: string;
    external_cluster_id?: string;
    managed?: boolean;
    product_category?: ClusterAuthorizationRequest.product_category;
    product_id?: ClusterAuthorizationRequest.product_id;
    quota_version?: string;
    reserve?: boolean;
    resources?: Array<ReservedResource>;
};

export namespace ClusterAuthorizationRequest {

    export enum product_category {
        ASSISTED_INSTALL = 'assistedInstall',
    }

    export enum product_id {
        OCP = 'ocp',
        OSD = 'osd',
        OSDTRIAL = 'osdtrial',
        MOA = 'moa',
        RHMI = 'rhmi',
    }


}

