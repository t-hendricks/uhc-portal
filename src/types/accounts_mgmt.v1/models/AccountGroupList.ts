/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AccountGroup } from './AccountGroup';
import type { List } from './List';

export type AccountGroupList = List & {
  items?: Array<AccountGroup>;
};
