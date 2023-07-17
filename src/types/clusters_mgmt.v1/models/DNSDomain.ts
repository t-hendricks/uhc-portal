/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ClusterLink } from './ClusterLink';
import type { OrganizationLink } from './OrganizationLink';

/**
 * Contains the properties of a DNS domain.
 */
export type DNSDomain = {
  /**
   * Indicates the type of this object. Will be 'DNSDomain' if this is a complete object or 'DNSDomainLink' if it is just a link.
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
   * Link to the cluster that is registered with the DNS domain (optional).
   */
  cluster_link?: ClusterLink;
  /**
   * Link to the organization that reserved the DNS domain.
   */
  organization_link?: OrganizationLink;
  /**
   * Date and time when the DNS domain was reserved.
   */
  reserved_at?: string;
};
