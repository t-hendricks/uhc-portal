/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RegistryAllowlist } from './RegistryAllowlist';
import type { RegistryLocation } from './RegistryLocation';
import type { RegistrySources } from './RegistrySources';
/**
 * ClusterRegistryConfig describes the configuration of registries for the cluster.
 * Its format reflects the OpenShift Image Configuration, for which docs are available on
 * [docs.openshift.com](https://docs.openshift.com/container-platform/4.16/openshift_images/image-configuration.html)
 * ```json
 * {
 * "registry_config": {
 * "registry_sources": {
 * "blocked_registries": [
 * "badregistry.io",
 * "badregistry8.io"
 * ]
 * }
 * }
 * }
 * ```
 *
 */
export type ClusterRegistryConfig = {
  /**
   * A map containing the registry hostname as the key, and the PEM-encoded certificate as the value,
   * for each additional registry CA to trust.
   */
  additional_trusted_ca?: Record<string, string>;
  /**
   * AllowedRegistriesForImport limits the container image registries that normal users may import
   * images from. Set this list to the registries that you trust to contain valid Docker
   * images and that you want applications to be able to import from. Users with
   * permission to create Images or ImageStreamMappings via the API are not affected by
   * this policy - typically only administrators or system integrations will have those
   * permissions.
   */
  allowed_registries_for_import?: Array<RegistryLocation>;
  /**
   * PlatformAllowlist contains a reference to a RegistryAllowlist which is a list of internal registries
   * which needs to be whitelisted for the platform to work. It can be omitted at creation and
   * updating and its lifecycle can be managed separately if needed.
   */
  platform_allowlist?: RegistryAllowlist;
  /**
   * RegistrySources contains configuration that determines how the container runtime
   * should treat individual registries when accessing images for builds+pods. (e.g.
   * whether or not to allow insecure access). It does not contain configuration for the
   * internal cluster registry.
   */
  registry_sources?: RegistrySources;
};
