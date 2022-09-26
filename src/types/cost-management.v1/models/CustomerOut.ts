/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Customer } from './Customer';

export type CustomerOut = Customer & {
  uuid: string;
  date_created: string;
};
