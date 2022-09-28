/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ClusterTransfer } from './ClusterTransfer';
import type { List } from './List';

export type ClusterTransferList = List & {
  items?: Array<ClusterTransfer>;
};
