/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { SkuRules } from './SkuRules';

export type SkuRulesList = (List & {
    items?: Array<SkuRules>;
});

