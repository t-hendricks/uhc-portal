/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { operator_status } from './operator_status';

export type operator_monitor_report = {
  /**
   * Unique name of the operator.
   */
  name?: string;
  status?: operator_status;
  /**
   * Detailed information about the operator state.
   */
  status_info?: string;
};
