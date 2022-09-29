/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { operator_status } from './operator_status';
import type { operator_type } from './operator_type';

export type monitored_operator = {
  /**
   * The cluster that this operator is associated with.
   */
  cluster_id?: string;
  /**
   * Unique name of the operator.
   */
  name?: string;
  /**
   * Namespace where to deploy an operator. Only some operators require a namespace.
   */
  namespace?: string;
  operator_type?: operator_type;
  /**
   * Blob of operator-dependent parameters that are required for installation.
   */
  properties?: string;
  status?: operator_status;
  /**
   * Detailed information about the operator state.
   */
  status_info?: string;
  /**
   * Time at which the operator was last updated.
   */
  status_updated_at?: string;
  /**
   * The name of the subscription of the operator.
   */
  subscription_name?: string;
  /**
   * Positive number represents a timeout in seconds for the operator to be available.
   */
  timeout_seconds?: number;
};
