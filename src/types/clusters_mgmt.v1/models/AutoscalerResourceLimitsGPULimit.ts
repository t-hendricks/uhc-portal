/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ResourceRange } from './ResourceRange';

export type AutoscalerResourceLimitsGPULimit = {
  range?: ResourceRange;
  /**
   * The type of GPU to associate with the minimum and maximum limits.
   * This value is used by the Cluster Autoscaler to identify Nodes that will have GPU capacity by searching
   * for it as a label value on the Node objects. For example, Nodes that carry the label key
   * `cluster-api/accelerator` with the label value being the same as the Type field will be counted towards
   * the resource limits by the Cluster Autoscaler.
   */
  type?: string;
};
