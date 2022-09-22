/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { source_state } from './source_state';

export type ntp_source = {
    /**
     * NTP source name or IP.
     */
    source_name?: string;
    /**
     * Indication of state of an NTP source.
     */
    source_state?: source_state;
};

