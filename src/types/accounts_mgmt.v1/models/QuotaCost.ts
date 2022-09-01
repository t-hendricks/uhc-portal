/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CloudAccount } from './CloudAccount';
import type { ObjectReference } from './ObjectReference';
import type { RelatedResource } from './RelatedResource';

export type QuotaCost = (ObjectReference & {
    allowed: number;
    cloud_accounts?: Array<CloudAccount>;
    consumed: number;
    organization_id?: string;
    quota_id: string;
    related_resources?: Array<RelatedResource>;
    version?: string;
});

