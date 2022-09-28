/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AccountGroupAssignment } from './AccountGroupAssignment';
import type { List } from './List';

export type AccountGroupAssignmentList = List & {
  items?: Array<AccountGroupAssignment>;
};
