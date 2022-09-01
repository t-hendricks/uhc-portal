/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';
import type { SummaryMetrics } from './SummaryMetrics';

export type Summary = (ObjectReference & {
    metrics: Array<SummaryMetrics>;
    name?: string;
});

