/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { Role } from './Role';

export type RoleList = (List & {
    items?: Array<Role>;
});

