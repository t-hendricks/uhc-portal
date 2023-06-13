/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Contract } from './Contract';

export type CloudAccount = {
  cloud_account_id: string;
  cloud_provider_id: string;
  contracts: Array<Contract>;
};
