/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContractDimension } from './ContractDimension';

export type Contract = {
  dimensions?: Array<ContractDimension>;
  end_date?: string;
  start_date?: string;
};
