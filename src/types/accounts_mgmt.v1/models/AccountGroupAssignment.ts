/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type AccountGroupAssignment = (ObjectReference & {
    account_group_id: string;
    account_id: string;
    created_at?: string;
    updated_at?: string;
});

