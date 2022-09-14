/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type feature_support_level = {
    features?: Array<{
        /**
         * The ID of the feature
         */
        feature_id?: 'ADDITIONAL_NTP_SOURCE' | 'REQUESTED_HOSTNAME' | 'PROXY' | 'SNO' | 'DAY2_HOSTS' | 'VIP_AUTO_ALLOC' | 'DISK_SELECTION' | 'OVN_NETWORK_TYPE' | 'SDN_NETWORK_TYPE' | 'PLATFORM_SELECTION' | 'SCHEDULABLE_MASTERS' | 'AUTO_ASSIGN_ROLE' | 'CUSTOM_MANIFEST' | 'DISK_ENCRYPTION' | 'CLUSTER_MANAGED_NETWORKING_WITH_VMS' | 'ARM64_ARCHITECTURE';
        support_level?: 'supported' | 'unsupported' | 'tech-preview' | 'dev-preview';
    }>;
    /**
     * Version of the OpenShift cluster.
     */
    openshift_version?: string;
};

