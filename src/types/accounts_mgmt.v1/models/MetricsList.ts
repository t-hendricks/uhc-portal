/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { Metric } from './Metric';

export type MetricsList = List & {
  items?: Array<Metric>;
};
