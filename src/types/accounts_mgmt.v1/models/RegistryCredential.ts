/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type RegistryCredential = (ObjectReference & {
    account?: ObjectReference;
    created_at?: string;
    external_resource_id?: string;
    registry?: ObjectReference;
    token?: string;
    updated_at?: string;
    username?: string;
});

