/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ClusterOperatorInfo } from './ClusterOperatorInfo';

/**
 * Provides detailed information about the operators installed on the cluster.
 */
export type ClusterOperatorsInfo = {
  operators?: Array<ClusterOperatorInfo>;
};
