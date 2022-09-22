/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { RoleBinding } from './RoleBinding';

export type RoleBindingList = (List & {
    items?: Array<RoleBinding>;
});

