/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AlertInfo } from './AlertInfo';

/**
 * Provides information about the alerts firing on the cluster.
 */
export type AlertsInfo = {
  alerts?: Array<AlertInfo>;
};
