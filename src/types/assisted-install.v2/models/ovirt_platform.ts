/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * oVirt platform-specific configuration upon which to perform the installation.
 */
export type ovirt_platform = {
    /**
     * The CA Bundle of the oVirt's engine certificate.
     */
    ca_bundle?: string | null;
    /**
     * The oVirt cluster ID.
     */
    cluster_id?: string | null;
    /**
     * The oVirt's engine fully qualified domain name.
     */
    fqdn?: string | null;
    /**
     * Verify oVirt engine certificate.
     */
    insecure?: boolean | null;
    /**
     * The oVirt network the VMs will be attached to.
     */
    network_name?: string | null;
    /**
     * The password for the oVirt user name.
     */
    password?: string | null;
    /**
     * The oVirt storage domain ID.
     */
    storage_domain_id?: string | null;
    /**
     * The user name to use to connect to the oVirt instance.
     */
    username?: string | null;
    /**
     * The oVirt VNIC profile ID.
     */
    vnic_profile_id?: string | null;
};

