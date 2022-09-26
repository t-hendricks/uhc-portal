/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Markup } from './Markup';
import type { TagRate } from './TagRate';
import type { TieredRate } from './TieredRate';

export type CostModel = {
  name: string;
  description: string;
  currency?: string;
  source_type: string;
  source_uuids?: Array<string>;
  rates?: Array<TieredRate | TagRate>;
  markup?: Markup;
  distribution?: CostModel.distribution;
};

export namespace CostModel {
  export enum distribution {
    MEMORY = 'memory',
    CPU = 'cpu',
  }
}
