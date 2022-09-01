/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';
import type { Permission } from './Permission';

export type Role = (ObjectReference & {
    name?: string;
    permissions?: Array<Permission>;
});

