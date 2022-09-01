/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Capability } from './Capability';
import type { Label } from './Label';
import type { ObjectReference } from './ObjectReference';
import type { Organization } from './Organization';

export type Account = (ObjectReference & {
    ban_code?: string;
    ban_description?: string;
    banned?: boolean;
    capabilities?: Array<Capability>;
    created_at?: string;
    email?: string;
    first_name?: string;
    labels?: Array<Label>;
    last_name?: string;
    organization?: Organization;
    organization_id?: string;
    rhit_account_id?: string;
    rhit_web_user_id?: string;
    service_account?: boolean;
    updated_at?: string;
    username: string;
});

