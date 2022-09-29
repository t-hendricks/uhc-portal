/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { l2_connectivity } from './l2_connectivity';
import type { l3_connectivity } from './l3_connectivity';

export type connectivity_remote_host = {
  host_id?: string;
  l2_connectivity?: Array<l2_connectivity>;
  l3_connectivity?: Array<l3_connectivity>;
};
