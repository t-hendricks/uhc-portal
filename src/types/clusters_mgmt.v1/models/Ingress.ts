/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ListeningMethod } from './ListeningMethod';
import type { LoadBalancerFlavor } from './LoadBalancerFlavor';
import type { NamespaceOwnershipPolicy } from './NamespaceOwnershipPolicy';
import type { WildcardPolicy } from './WildcardPolicy';

/**
 * Representation of an ingress.
 */
export type Ingress = {
  /**
   * Indicates the type of this object. Will be 'Ingress' if this is a complete object or 'IngressLink' if it is just a link.
   */
  kind?: string;
  /**
   * Unique identifier of the object.
   */
  id?: string;
  /**
   * Self link.
   */
  href?: string;
  /**
   * DNS Name of the ingress.
   */
  dns_name?: string;
  /**
   * Cluster routes hostname.
   */
  cluster_routes_hostname?: string;
  /**
   * Cluster routes TLS Secret reference.
   */
  cluster_routes_tls_secret_ref?: string;
  /**
   * Indicates if this is the default ingress.
   */
  default?: boolean;
  /**
   * A set of excluded namespaces for the ingress.
   */
  excluded_namespaces?: Array<string>;
  /**
   * Listening method of the ingress
   */
  listening?: ListeningMethod;
  /**
   * Load Balancer type of the ingress
   */
  load_balancer_type?: LoadBalancerFlavor;
  /**
   * Namespace Ownership Policy for the ingress.
   */
  route_namespace_ownership_policy?: NamespaceOwnershipPolicy;
  /**
   * A set of labels for the ingress.
   */
  route_selectors?: Record<string, string>;
  /**
   * Wildcard policy for the ingress.
   */
  route_wildcard_policy?: WildcardPolicy;
};
