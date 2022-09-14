/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { Quota } from './Quota';

export type QuotaList = (List & {
    items?: Array<Quota>;
});

