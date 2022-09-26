/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { Permission } from './Permission';

export type PermissionList = List & {
  items?: Array<Permission>;
};
