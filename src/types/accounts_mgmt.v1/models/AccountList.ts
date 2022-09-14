/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Account } from './Account';
import type { List } from './List';

export type AccountList = (List & {
    items?: Array<Account>;
});

