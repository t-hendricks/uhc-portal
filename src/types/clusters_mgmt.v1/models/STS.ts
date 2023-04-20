/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { InstanceIAMRoles } from './InstanceIAMRoles';
import type { OidcConfig } from './OidcConfig';
import type { OperatorIAMRole } from './OperatorIAMRole';

/**
 * Contains the necessary attributes to support role-based authentication on AWS.
 */
export type STS = {
  /**
   * URL of the location where OIDC configuration and keys are available
   */
  oidc_endpoint_url?: string;
  /**
   * Auto creation mode for cluster - OCM will create the operator roles and OIDC provider. false by default.
   */
  auto_mode?: boolean;
  /**
   * If STS is enabled or disabled
   */
  enabled?: boolean;
  /**
   * Optional unique identifier when assuming role in another account
   */
  external_id?: string;
  /**
   * Instance IAM roles to use for the instance profiles of the master and worker instances
   */
  instance_iam_roles?: InstanceIAMRoles;
  /**
   * If true, cluster account and operator roles have managed policies attached.
   */
  managed_policies?: boolean;
  /**
   * Registered Oidc Config, if available holds information related to the oidc config
   */
  oidc_config?: OidcConfig;
  /**
   * List of roles necessary to access the AWS resources of the various operators used during installation
   */
  operator_iam_roles?: Array<OperatorIAMRole>;
  /**
   * Optional user provided prefix for operator roles.
   */
  operator_role_prefix?: string;
  /**
   * Optional user provided permission boundary.
   */
  permission_boundary?: string;
  /**
   * ARN of the AWS role to assume when installing the cluster
   */
  role_arn?: string;
  /**
   * ARN of the AWS role used by SREs to access the cluster AWS account in order to provide support
   */
  support_role_arn?: string;
};
