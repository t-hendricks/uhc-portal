/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { boot } from './boot';
import type { cpu } from './cpu';
import type { disk } from './disk';
import type { gpu } from './gpu';
import type { interface_ } from './interface';
import type { memory } from './memory';
import type { route } from './route';
import type { system_vendor } from './system_vendor';

export type inventory = {
  bmc_address?: string;
  bmc_v6address?: string;
  boot?: boot;
  cpu?: cpu;
  disks?: Array<disk>;
  gpus?: Array<gpu>;
  hostname?: string;
  interfaces?: Array<interface_>;
  memory?: memory;
  routes?: Array<route>;
  system_vendor?: system_vendor;
  timestamp?: number;
  tpm_version?: inventory.tpm_version;
};

export namespace inventory {
  export enum tpm_version {
    NONE = 'none',
    _1_2 = '1.2',
    _2_0 = '2.0',
  }
}
