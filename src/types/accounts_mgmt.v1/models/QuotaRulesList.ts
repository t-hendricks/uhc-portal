/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { QuotaRules } from './QuotaRules';

export type QuotaRulesList = (List & {
    items?: Array<QuotaRules>;
});

