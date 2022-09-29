/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ClusterOperatorState } from './ClusterOperatorState';

export type ClusterOperatorInfo = {
  /**
   * Operator status.  Empty string if unknown.
   */
  condition?: ClusterOperatorState;
  /**
   * Name of the operator.
   */
  name?: string;
  /**
   * Extra detail on condition, if available.  Empty string if unknown.
   */
  reason?: string;
  /**
   * Time when the sample was obtained, in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) format.
   */
  time?: string;
  /**
   * Current version of the operator.  Empty string if unknown.
   */
  version?: string;
};
