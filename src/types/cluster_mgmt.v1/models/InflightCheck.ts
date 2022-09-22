/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { InflightCheckState } from './InflightCheckState';

/**
 * Representation of check running before the cluster is provisioned.
 */
export type InflightCheck = {
    /**
     * Indicates the type of this object. Will be 'InflightCheck' if this is a complete object or 'InflightCheckLink' if it is just a link.
     */
    kind?: string;
    /**
     * Unique identifier of the object.
     */
    id?: string;
    /**
     * Self link.
     */
    href?: string;
    /**
     * Details regarding the state of the inflight check.
     */
    details?: any;
    /**
     * The time the check finished running.
     */
    ended_at?: string;
    /**
     * The name of the inflight check.
     */
    name?: string;
    /**
     * The number of times the inflight check restarted.
     */
    restarts?: number;
    /**
     * The time the check started running.
     */
    started_at?: string;
    /**
     * State of the inflight check.
     */
    state?: InflightCheckState;
};

