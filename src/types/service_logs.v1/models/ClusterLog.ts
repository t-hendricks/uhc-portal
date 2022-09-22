/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type ClusterLog = (ObjectReference & {
    cluster_id?: string;
    cluster_uuid?: string;
    created_at?: string;
    created_by?: string;
    description?: string;
    email?: string;
    event_stream_id?: string;
    first_name?: string;
    internal_only?: boolean;
    last_name?: string;
    service_name?: string;
    severity?: ClusterLog.severity;
    subscription_id?: string;
    summary?: string;
    timestamp?: string;
    username?: string;
});

export namespace ClusterLog {

    export enum severity {
        DEBUG = 'Debug',
        INFO = 'Info',
        WARNING = 'Warning',
        ERROR = 'Error',
        FATAL = 'Fatal',
    }


}

