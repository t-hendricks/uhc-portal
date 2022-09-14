/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type Metric = (ObjectReference & {
    external_id?: string;
    health_state?: string;
    id?: string;
    metrics?: string;
    query_timestamp?: string;
});

