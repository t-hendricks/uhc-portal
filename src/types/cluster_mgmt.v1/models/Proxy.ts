/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Proxy configuration of a cluster.
 */
export type Proxy = {
    /**
     * HTTPProxy is the URL of the proxy for HTTP requests.
     */
    http_proxy?: string;
    /**
     * HTTPSProxy is the URL of the proxy for HTTPS requests.
     */
    https_proxy?: string;
    /**
     * NoProxy is a comma-separated list of domains and CIDRs for which
     * the proxy should not be used
     */
    no_proxy?: string;
};

