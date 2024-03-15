/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BillingModel } from './BillingModel';
import type { List } from './List';

export type BillingModelList = List & {
  items?: Array<BillingModel>;
};
