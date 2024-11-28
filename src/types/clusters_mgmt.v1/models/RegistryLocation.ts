/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * RegistryLocation contains a location of the registry specified by the registry domain
 * name. The domain name might include wildcards, like '*' or '??'.
 */
export type RegistryLocation = {
  /**
   * domainName specifies a domain name for the registry
   * In case the registry use non-standard (80 or 443) port, the port should be included
   * in the domain name as well.
   */
  domain_name?: string;
  /**
   * insecure indicates whether the registry is secure (https) or insecure (http)
   * By default (if not specified) the registry is assumed as secure.
   */
  insecure?: boolean;
};
