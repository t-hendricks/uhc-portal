/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { ReservedResource } from './ReservedResource';

export type ReservedResourceList = (List & {
    items?: Array<ReservedResource>;
});

