/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ClusterLog } from './ClusterLog';
import type { List } from './List';

export type ClusterLogList = List & {
  items?: Array<ClusterLog>;
};
