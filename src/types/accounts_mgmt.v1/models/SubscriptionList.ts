/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { Subscription } from './Subscription';

export type SubscriptionList = (List & {
    items?: Array<Subscription>;
});

