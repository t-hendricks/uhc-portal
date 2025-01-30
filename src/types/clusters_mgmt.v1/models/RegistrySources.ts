/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * RegistrySources contains configuration that determines how the container runtime should treat individual
 * registries when accessing images for builds and pods. For instance, whether or not to allow insecure access.
 * It does not contain configuration for the internal cluster registry.
 */
export type RegistrySources = {
  /**
   * AllowedRegistries: registries for which image pull and push actions are allowed.
   * To specify all subdomains, add the asterisk (*) wildcard character as a prefix to the domain name.
   * For example, *.example.com. You can specify an individual repository within a registry.
   * For example: reg1.io/myrepo/myapp:latest. All other registries are blocked.
   * Mutually exclusive with `BlockedRegistries`
   */
  allowed_registries?: Array<string>;
  /**
   * BlockedRegistries: registries for which image pull and push actions are denied.
   * To specify all subdomains, add the asterisk (*) wildcard character as a prefix to the domain name.
   * For example, *.example.com. You can specify an individual repository within a registry.
   * For example: reg1.io/myrepo/myapp:latest. All other registries are allowed.
   * Mutually exclusive with `AllowedRegistries`
   */
  blocked_registries?: Array<string>;
  /**
   * InsecureRegistries are registries which do not have a valid TLS certificate or only support HTTP connections.
   * To specify all subdomains, add the asterisk (*) wildcard character as a prefix to the domain name.
   * For example, *.example.com. You can specify an individual repository within a registry.
   * For example: reg1.io/myrepo/myapp:latest.
   */
  insecure_registries?: Array<string>;
};
