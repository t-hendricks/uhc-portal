/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DeletedSubscription } from './DeletedSubscription';
import type { List } from './List';

export type DeletedSubscriptionList = (List & {
    items?: Array<DeletedSubscription>;
});

