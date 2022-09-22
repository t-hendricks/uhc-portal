/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { QuotaCost } from './QuotaCost';

export type QuotaCostList = (List & {
    items?: Array<QuotaCost>;
});

