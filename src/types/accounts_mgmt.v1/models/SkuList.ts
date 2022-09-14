/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { SKU } from './SKU';

export type SkuList = (List & {
    items?: Array<SKU>;
});

