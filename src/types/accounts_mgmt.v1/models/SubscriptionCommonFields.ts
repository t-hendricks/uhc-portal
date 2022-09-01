/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type SubscriptionCommonFields = (ObjectReference & {
    /**
     * If set, the date the subscription expires based on the billing model
     */
    billing_expiration_date?: string;
    billing_marketplace_account?: string;
    cloud_account_id?: string;
    cloud_provider_id?: string;
    cluster_billing_model?: string;
    cluster_id?: string;
    console_url?: string;
    consumer_uuid?: string;
    cpu_total?: number;
    creator_id?: string;
    display_name?: string;
    external_cluster_id?: string;
    /**
     * Last time this subscription were reconciled about cluster usage
     */
    last_reconcile_date?: string;
    /**
     * Last time status was set to Released for this cluster/subscription in Unix time
     */
    last_released_at?: string;
    /**
     * Last telemetry authorization request for this cluster/subscription in Unix time
     */
    last_telemetry_date?: string;
    managed: boolean;
    organization_id?: string;
    plan_id?: string;
    product_bundle?: SubscriptionCommonFields.product_bundle;
    provenance?: string;
    region_id?: string;
    released?: boolean;
    service_level?: SubscriptionCommonFields.service_level;
    socket_total?: number;
    status?: string;
    support_level?: SubscriptionCommonFields.support_level;
    system_units?: SubscriptionCommonFields.system_units;
    /**
     * If the subscription is a trial, date the trial ends
     */
    trial_end_date?: string;
    usage?: SubscriptionCommonFields.usage;
});

export namespace SubscriptionCommonFields {

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

