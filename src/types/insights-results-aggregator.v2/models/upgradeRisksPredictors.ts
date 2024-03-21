/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { alert } from './alert';
import type { operator_condition } from './operator_condition';

export type upgradeRisksPredictors = {
  alerts: Array<alert>;
  operator_conditions: Array<operator_condition>;
};
