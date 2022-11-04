/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Label } from './Label';
import type { Syncset } from './Syncset';

/**
 * Representation of cluster external configuration.
 */
export type ExternalConfiguration = {
  /**
   * list of labels externally configured on the clusterdeployment.
   */
  labels?: Array<Label>;
  /**
   * list of syncsets externally configured on the cluster.
   */
  syncsets?: Array<Syncset>;
};
