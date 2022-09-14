/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AlertSeverity } from './AlertSeverity';

/**
 * Provides information about a single alert firing on the cluster.
 */
export type AlertInfo = {
    /**
     * The alert name. Multiple alerts with same name are possible.
     */
    name?: string;
    /**
     * The alert severity.
     */
    severity?: AlertSeverity;
};

