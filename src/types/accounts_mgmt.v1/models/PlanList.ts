/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { Plan } from './Plan';

export type PlanList = List & {
  items?: Array<Plan>;
};
