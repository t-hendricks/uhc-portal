/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type domain_resolution_response = {
    resolutions: Array<{
        /**
         * The domain that was resolved
         */
        domain_name: string;
        /**
         * The IPv4 addresses of the domain, empty if none
         */
        ipv4_addresses?: Array<string>;
        /**
         * The IPv6 addresses of the domain, empty if none
         */
        ipv6_addresses?: Array<string>;
    }>;
};

