/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type Quota = (ObjectReference & {
    created_at?: string;
    description?: string;
    resource_type?: string;
    updated_at?: string;
});

