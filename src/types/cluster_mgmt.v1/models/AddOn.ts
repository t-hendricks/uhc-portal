/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AddOnConfig } from './AddOnConfig';
import type { AddOnInstallMode } from './AddOnInstallMode';
import type { AddOnParameter } from './AddOnParameter';
import type { AddOnRequirement } from './AddOnRequirement';
import type { AddOnSubOperator } from './AddOnSubOperator';
import type { AddOnVersion } from './AddOnVersion';
import type { CredentialRequest } from './CredentialRequest';

/**
 * Representation of an add-on that can be installed in a cluster.
 */
export type AddOn = {
  /**
   * Indicates the type of this object. Will be 'AddOn' if this is a complete object or 'AddOnLink' if it is just a link.
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
   * Additional configs to be used by the addon once its installed in the cluster.
   */
  config?: AddOnConfig;
  /**
   * List of credentials requests to authenticate operators to access cloud resources.
   */
  credentials_requests?: Array<CredentialRequest>;
  /**
   * Description of the add-on.
   */
  description?: string;
  /**
   * Link to documentation about the add-on.
   */
  docs_link?: string;
  /**
   * Indicates if this add-on can be added to clusters.
   */
  enabled?: boolean;
  /**
   * Indicates if this add-on has external resources associated with it
   */
  has_external_resources?: boolean;
  /**
   * Indicates if this add-on is hidden.
   */
  hidden?: boolean;
  /**
   * Base64-encoded icon representing an add-on. The icon should be in PNG format.
   */
  icon?: string;
  /**
   * The mode in which the addon is deployed.
   */
  install_mode?: AddOnInstallMode;
  /**
   * Label used to attach to a cluster deployment when add-on is installed.
   */
  label?: string;
  /**
   * Indicates if add-on is part of a managed service
   */
  managed_service?: boolean;
  /**
   * Name of the add-on.
   */
  name?: string;
  /**
   * The name of the operator installed by this add-on.
   */
  operator_name?: string;
  /**
   * List of parameters for this add-on.
   */
  parameters?: Array<AddOnParameter>;
  /**
   * List of requirements for this add-on.
   */
  requirements?: Array<AddOnRequirement>;
  /**
   * Used to determine how many units of quota an add-on consumes per resource name.
   */
  resource_cost?: number;
  /**
   * Used to determine from where to reserve quota for this add-on.
   */
  resource_name?: string;
  /**
   * List of sub operators for this add-on.
   */
  sub_operators?: Array<AddOnSubOperator>;
  /**
   * The namespace in which the addon CRD exists.
   */
  target_namespace?: string;
  /**
   * Link to the current default version of this add-on.
   */
  version?: AddOnVersion;
};
