/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ListeningMethod } from './ListeningMethod';
import type { LoadBalancerFlavor } from './LoadBalancerFlavor';

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
   * Indicates if this is the default ingress.
   */
  default?: boolean;
  /**
   * Listening method of the ingress
   */
  listening?: ListeningMethod;
  /**
   * Load Balancer type of the ingress
   */
  load_balancer_type?: LoadBalancerFlavor;
  /**
   * A set of labels for the ingress.
   */
  route_selectors?: Record<string, string>;
};
