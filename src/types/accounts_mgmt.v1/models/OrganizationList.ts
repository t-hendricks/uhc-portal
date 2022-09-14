/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { Organization } from './Organization';

export type OrganizationList = (List & {
    items?: Array<Organization>;
});

