/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CostModelResp } from './CostModelResp';
import type { Markup } from './Markup';

export type CostModelOut = (CostModelResp & {
    readonly uuid?: string;
    readonly created_timestamp?: string;
    readonly updated_timestamp?: string;
    markup?: Markup;
});

