/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ForecastData } from './ForecastData';
import type { ListPagination } from './ListPagination';

export type Forecast = ListPagination & {
  data: Array<ForecastData>;
};
