/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SubscriptionPatchRequest = {
    billing_expiration_date?: string;
    cloud_account_id?: string;
    cloud_provider_id?: string;
    cluster_billing_model?: SubscriptionPatchRequest.cluster_billing_model;
    cluster_id?: string;
    console_url?: string;
    consumer_uuid?: string;
    cpu_total?: number;
    creator_id?: string;
    display_name?: string;
    external_cluster_id?: string;
    managed?: boolean;
    organization_id?: string;
    plan_id?: string;
    product_bundle?: SubscriptionPatchRequest.product_bundle;
    provenance?: string;
    region_id?: string;
    released?: boolean;
    service_level?: SubscriptionPatchRequest.service_level;
    socket_total?: number;
    status?: string;
    support_level?: SubscriptionPatchRequest.support_level;
    system_units?: SubscriptionPatchRequest.system_units;
    trial_end_date?: string;
    usage?: SubscriptionPatchRequest.usage;
};

export namespace SubscriptionPatchRequest {

    export enum cluster_billing_model {
        STANDARD = 'standard',
        MARKETPLACE = 'marketplace',
        MARKETPLACE_AWS = 'marketplace-aws',
        MARKETPLACE_AZURE = 'marketplace-azure',
        MARKETPLACE_RHM = 'marketplace-rhm',
    }

    export enum product_bundle {
        OPENSHIFT = 'Openshift',
        JBOSS_MIDDLEWARE = 'JBoss-Middleware',
        IBM_CLOUD_PAK = 'IBM-CloudPak',
    }

    export enum service_level {
        L1_L3 = 'L1-L3',
        L3_ONLY = 'L3-only',
    }

    export enum support_level {
        EVAL = 'Eval',
        STANDARD = 'Standard',
        PREMIUM = 'Premium',
        SELF_SUPPORT = 'Self-Support',
        NONE = 'None',
    }

    export enum system_units {
        CORES_V_CPU = 'Cores/vCPU',
        SOCKETS = 'Sockets',
    }

    export enum usage {
        PRODUCTION = 'Production',
        DEVELOPMENT_TEST = 'Development/Test',
        DISASTER_RECOVERY = 'Disaster Recovery',
        ACADEMIC = 'Academic',
    }


}

